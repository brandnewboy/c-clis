import path from 'path'

export default {
    entry: path.isAbsolute(entryPath) ? entryPath : path.resolve(entryPath),
    output: './dist',
    hooks: [
        ['start', () => {
            console.log('start hook fn1')
        }],
        ['start', () => {
            console.log('start hook fn2')
        }]
    ],
    plugins: [
        'c-build-plugin-test1',
        'c-build-plugin-vue'
    ]
}