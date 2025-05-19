const path = require('node:path');
const logger = require('../lib/utils/logger');
module.exports = function (ctx, params) {
    logger.info({
        prefix: 'InitPlugin',
        message: 'InitPlugin is running, init some webpack config'
    })

    /**
     * @type {import('webpack-5-chain')}
     */
    const config = ctx.getWebpackConfig()


    // 用户使用该脚手架执行命令的项目目录
    const runCmdDir = process.cwd()

    // 设置构建模式
    const buildMode = process.env.C_BUILD_MODE || 'development'

    config.mode(buildMode);
    logger.info({
        prefix: 'InitPlugin',
        message: `set webpack building mode: ${buildMode}`,
    })

    // 设置entry
    config
        .entry('index')
        .add(path.resolve(runCmdDir, './src/index.js'))
        .end();
    logger.info({
        prefix: 'InitPlugin',
        message: `set webpack entry point, index: './src/index.js'`,
    })

    // 设置output
    config
        .output
        .path(path.resolve(runCmdDir, './dist'))
        .filename('[name]_[hash].js')
        .end();
    logger.info({
        prefix: 'InitPlugin',
        message: `set webpack output, dist: '[name]_[hash].js'`,
    })

    // 设置module loader配置

    logger.verbose({
        prefix: 'InitPlugin finished webpack config',
        message: config.toConfig()
    })
}