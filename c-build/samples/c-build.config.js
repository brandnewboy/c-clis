const path = require('node:path')

const entryPath = './src/index.js'
module.exports = {
    entry: path.isAbsolute(entryPath) ? entryPath : path.resolve(entryPath),
    output: './dist',
    hooks: [
        ['start', () => {
            console.log('start hook fn1 from cjs')
        }],
        ['start', () => {
            console.log('start hook fn2 from cjs')
        }],
        ['start', 'c-build-custom-hook01']
    ],
    // plugins: [
    //     'c-build-plugin-test1',
    //     ['c-build-plugin-vue', { a: 1, b: 2 }],
    //     ['./plugins/c-build-plugin-custom01', { name: 'zahngsan', age: 23 }],
    // ]

    plugins: function() {
        return [
            ['./plugins/c-build-plugin-custom01', { name: 'zahngsan', age: 23 }],
            function (ctx) {
                console.log(ctx.getValue('sharedState1'))
            }
        ]
    }

    /**
     * plugins: function() {}
     */
}