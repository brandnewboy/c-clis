import path from "node:path";

module.exports = function ({ getWebpackConfig }) {
    /**
     * @type {import('webpack-5-chain')}
     */
    const config = getWebpackConfig()
    config
        .entry('index')
        .clear()
        .add('./index.js')
        .end();

    config
        .plugin('mini-css')
        .tap(args => {
            return [
                {
                    filename: 'css/[name].css',
                    chunkFilename: 'css/[name].css'
                }
            ]
        })
        .end();

    // 设置module scss 相关 loader配置
    config
        .module
        .rule('sass')
        .test(/\.scss$/)
        .exclude
        .add(/node_modules/)
        .end()
        .use('mini-css')
        .loader(MiniCssExtractPlugin.loader)
        .end()
        .use('css-loader')
        .loader('css-loader')
        .options({
            modules: {
                // 正则匹配文件名以 'xxxxxxxx.module.scss' 结尾的文件
                auto: /\.module\.scss$/,
                mode: (resourcePath) => {
                    // if (/pure.css$/i.test(resourcePath)) {
                    //     return 'pure';
                    // }
                    //
                    // if (/global.css$/i.test(resourcePath)) {
                    //     return 'global';
                    // }

                    if (resourcePath.includes('.i.module.')) {
                        return 'icss';
                    }

                    // return 'icss';
                    return 'local';
                },
                // exportGlobals: true,
                // localIdentName: '[path][name]__[local]--[hash:base64:5]',
                // localIdentContext: path.resolve(__dirname, 'src'),
                // localIdentHashSalt: 'my-custom-hash',
                namedExport: true,
                exportLocalsConvention: 'camelCaseOnly',
                // exportOnlyLocals: false,
            }
        })
        .end()
        .use('sass-loader')
        .loader('sass-loader')
        .end();

    // 配置 resolve alias 路径解析 '@' -> src
    config
        .resolve
        .alias
        .set('@', path.resolve(__dirname, './src')).end();

    config.plugin('html').tap(args => {
        return [
            {
                title: 'c-build App css&layout',
                filename: 'index.html',
                template: path.resolve(process.cwd(), './public/index.html'),
                meta: {
                    viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
                },
                chunks: ['index']
            }
        ]
    }).end();

    config.plugin('provide').tap(args => {
        return [
            {
                // helper: path.resolve(__dirname, './src/helper/index.js')
            }
        ]
    }).end();

}