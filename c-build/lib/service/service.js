const fs = require('node:fs')
const path = require('node:path')
const {
    getConfigFilePath,
    loadModule
} = require('../utils/index')
const WebpackChain = require('webpack-5-chain')
const Consts = require('./constants')
const { judgeIfExists } = require("../utils")
const InitPlugin = require('../../plugins//init-plugin')
const logger = require('../../lib/utils/logger')

class Service {
    options = null
    config = null
    hooks = null
    dir = process.cwd()
    plugins = []
    /**
     * @type {import('webpack-5-chain')}
     */
    webpackChain = null
    webpack = null
    internalValue = {}

    constructor(options) {
        this.options = options
        this.config = {}
        this.hooks = {}
    }

    async start() {
        await this.resolveConfig()
        await this.registerHooks()
        await this.emitHooks(Consts.HOOK_START)
        await this.registerPlugins()
        await this.runPlugin()
        await this.initWebpack()
    }

    async resolveConfig() {
        const { config } = this.options
        let configFilePath = ''

        // process the config file path
        configFilePath = getConfigFilePath({ config, dir: this.dir })

        // check if the config file exists
        if (!(configFilePath && fs.existsSync(configFilePath))) {
            logger.error({ prefix: 'Service resolveConfig fail', message: 'configFilePath does not exist' })
            process.exit(1)
        }

        // get the config file contents
        let _config = {}
        _config = await loadModule(configFilePath);
        this.config = _config

        this.webpackChain = new WebpackChain()

        this.webpackChain
            .mode('development')
            .output
            .path('dist')
            .filename('[name]-[hash].js')
            .end();
        // this.webpackChain.module
        //     .rule('lint')
        //     .test(/\.js$/)
        //     .exclude
        //     .add('node_modules')
        //     .end()
        //     .include
        //     .add('src')
        //     .end()
        //     .use('eslint')
        //     .loader('eslint-loader')
        //     .options({
        //         rules: {
        //             semi: 'off',
        //         }
        //     })
        // console.log(JSON.stringify(this.webpackChain.toConfig()))
        logger.verbose({
            prefix: 'Service resolveConfig complete',
            message: this.config
        })
        logger.verbose({
            prefix: 'Service resolve webpack-chain Config complete',
            message: this.webpackChain.toConfig()
        })
    }

    async registerHooks() {
        /**
         * [
         *     ['stage', fn],
         *     ['stage', fn]
         *     ......
         * ]
         */
        const { hooks = [] } = this.config

        if (!hooks || hooks.length <= 0) return

        const hookKeys = Object.values(Consts)
        // console.log('hookKeys', hookKeys)
        for (const [stage, fn] of hooks) {
            if (
                (stage && fn)
                && (hookKeys.includes(stage))
                && (typeof stage === 'string')
            ) {
                const existHook = this.hooks[stage]
                if (!existHook) {
                    this.hooks[stage] = []
                }
                if (typeof fn === 'function') {
                    this.hooks[stage].push(fn)
                    continue;
                }
                if (typeof fn === 'string') {
                    // const _hookFnPath = fn//processPath(fn)
                    // console.log(_hookFnPath)
                    // if (!judgeIfExists(_hookFnPath, 'hook函数不存在')) {
                    //     continue;
                    // }
                    const _hookFn = await loadModule(fn)
                    this.hooks[stage].push(_hookFn)
                }

            }
        }

        logger.verbose({
            prefix: 'Service registerHooks complete',
            message: this.hooks
        })
        // console.log(this.hooks)
    }

    async emitHooks(key) {
        const hooks = this.hooks[key]
        if (!hooks || hooks.length <= 0) return

        for (let i = 0; i < hooks.length; i++) {
            try {
                await hooks[i](this)
            } catch (e) {
                logger.error({ message: `hook ${key} failed.` })
                logger.error({ message: e })
            }

        }
    }

    async registerPlugins() {
        const { plugins: _plugins } = this.config
        // 内置插件
        const builtInPlugins = [InitPlugin]
        builtInPlugins.forEach(plugin => {
            this.plugins.push({ mod: plugin })
        })
        if (!_plugins) return

        let plugins;
        // 1 plugins: function() {} plugin是一个函数
        if (typeof _plugins === 'function') {
            plugins = _plugins()
        } else if (Array.isArray(_plugins)) {
            // 2 plugins: [] plugin是一个数组
            plugins = _plugins
        }

        // 2 plugins: []  plugin是一个数组才执行，避免_plugins()返回的不是数组
        if (Array.isArray(plugins)) {
            for (const plugin of plugins) {
                // 1.1 plugins: ['plugin-name/path']
                if (typeof plugin === 'string') {
                    const mod = await loadModule(plugin)
                    this.plugins.push({ mod })
                }

                // 1.2 plugins: [['plugin-name', options]]
                if (Array.isArray(plugin)) {
                    const [pluginPath, pluginParams] = plugin
                    const mod = await loadModule(pluginPath)
                    this.plugins.push({ mod, params: pluginParams })
                }

                // 1.3 plugins: [function() {}]
                if (typeof plugin === 'function') {
                    this.plugins.push({ mod: plugin })
                }
            }
        }

        logger.verbose({
            prefix: 'Service register plugins complete',
            message: this.plugins
        })
    }

    async runPlugin() {
        for (const plugin of this.plugins) {
            const { mod, params } = plugin
            if (!mod) continue;
            const API = {
                getWebpackConfig: this._getWebpackConfig,
                emitHooks: key => this.emitHooks(key),
                setValue: this._setValue,
                getValue: this._getValue
            }
            const options = {
                ...params
            }
            await mod(API, options)
        }
    }

    async initWebpack() {
        const { customWebpackPath } = this.options
        if (!judgeIfExists(customWebpackPath, 'customWebpackPath不存在, 将默认使用当前项目node_modules中的webpack')) {
            this.webpack = require.resolve('webpack', {
                paths: [
                    path.resolve(process.cwd(), 'node_modules')
                ]
            })
        } else {
            this.webpack = path.resolve(customWebpackPath)
        }

        logger.verbose({
            prefix: 'Service initWebpack complete',
            message: this.webpack
        })
    }

    _getWebpackConfig = () => {
        return this.webpackChain
    }

    _setValue = (key, value) => {
        this.internalValue[key] = value
    }

    _getValue = (key) => {
        return this.internalValue[key]
    }

}

module.exports = Service