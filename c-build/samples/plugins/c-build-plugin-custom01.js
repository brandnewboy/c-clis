module.exports = function(ctx, params) {
    const webpackConfig = ctx.getWebpackConfig()
    webpackConfig
        .entryPoints
        .delete('login')
        .end();
    webpackConfig
        .entry('main')
        .add('src/main.js')
        .end()
        .output
        .path('./dist')
        .filename('[name]-[hash].js')
        .end();

    ctx.setValue('sharedState1', {
        name: 'comes from c-build-plugin-custom01',
        age: 23
    });
}