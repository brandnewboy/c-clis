const path = require('node:path');
const logger = require('../lib/utils/logger');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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
        message: `set webpack building mode completed: ${buildMode}`,
    })

    // 设置entry
    config
        .entry('index')
        .add(path.resolve(runCmdDir, './src/index.js'))
        .end();
    logger.info({
        prefix: 'InitPlugin',
        message: `set webpack entry point completed, index: './src/index.js'`,
    })

    // 设置output
    config
        .output
        .path(path.resolve(runCmdDir, './dist'))
        .filename('[name]_[hash].js')
        .end();
    logger.info({
        prefix: 'InitPlugin',
        message: `set webpack output completed, dist: '[name]_[hash].js'`,
    })

    // 设置module css 相关 loader配置
    config
        .module
        .rule('css')
        .test(/\.css$/)
        .exclude
        .add(/node_modules/)
        .end()
        .use('mini-css')
        .loader(MiniCssExtractPlugin.loader)
        .end()
        .use('css-loader')
        .loader('css-loader')
        .end();
    logger.info({
        prefix: 'InitPlugin',
        message: `set webpack module css related loader completed: MiniCssExtractPlugin.loader + 'css-loader'`,
    })

    // 设置 module 图片相关 loader配置
    config
       .module
       .rule('images')
       .test(/\.(png|svg|jpe?g|gif|webp)(\?.*)?$/)
        .type('asset')
        .parser({
            dataUrlCondition: {
                maxSize: 3 * 1024 // 10kb
            }
        })
        .generator({
            filename: 'images/[name].[hash].[ext]',
        })
        .end();
    logger.info({
        prefix: 'InitPlugin',
        message: `set webpack module asset related loader completed`,
    })

    // 设置 module ejs相关 loader配置
    config
        .module
        .rule('ejs')
        .test(/\.ejs$/)
        .use('ejs-loader')
        .options({
            esModule: false
        })
        .end();
    logger.info({
        prefix: 'InitPlugin',
        message: `set webpack module ejs related loader completed: ejs-loader`,
    })





    logger.verbose({
        prefix: 'InitPlugin webpackConfig.module.rules',
        message: config.toConfig().module.rules,
    })

    logger.verbose({
        prefix: 'InitPlugin finished webpack config',
        message: config.toConfig()
    })
}