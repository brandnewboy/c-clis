const chokidar = require('chokidar')
const path = require('node:path')
const cp = require('node:child_process')
const { getConfigFilePath } = require('../utils/index')
const logger = require('../utils/logger')

// const runServer = () => {
//     // 启动webpack服务
//
//     // 启动子进程服务
//     console.log('主进程pid ---> ', process.pid)
//     // 方法一
//     // cp.execFile(
//     //     'node',
//     //     [path.resolve(__dirname, './devService.js'), '--force'],
//     //     {},
//     //     (err, stdout, stderr) => {
//     //         if (err) {
//     //             console.error(err)
//     //             process.exit(1)
//     //         }
//     //
//     //         console.log('execFile callback ---> ', stdout, stderr)
//     //     })
//
//     // 方法二
//     // cp.exec(`node ${path.resolve(__dirname, './devService.js')} --force`, (err, stdout, stderr) => {
//     //     if (err) {
//     //         console.error(err)
//     //         process.exit(1)
//     //     }
//     //     console.log('exec callback ---> ', stdout, stderr)
//     // })
//
//     // const buffer = cp.execSync(`node ${path.resolve(__dirname, './devService.js')} --force`)
//     // console.log(buffer.toString())
//
//     // 方法三
//     // const child = cp.spawn('node', [path.resolve(__dirname, './devService.js'), '--force'])
//     // child.stdout.on('data', (data) => {
//     //     console.log('stdout:', data.toString())
//     // })
//
//     // RPC remote process communicate
//     const scriptPath = path.resolve(__dirname, './devService.js')
//     const child = cp.fork(scriptPath, ['--port=8080'])
//     // child.on('data', data => {
//     //     console.log(data.toString())
//     // })
//     child.on('message', msg => {
//         console.log('接收到来自子进程的消息 ---> ', msg)
//     })
//     child.send(`Hello I'm from main process`)
// }

let child = null
const runServer = opts => {
    // 启动子进程服务 启动webpack服务
    const scriptPath = path.resolve(__dirname, './devService.js')

    const {
        config = '',
        customWebpackPath = '',
        mode = 'development'
    } = opts
    logger.verbose({ prefix: 'runServer args', message:  opts})
    child = cp.fork(
        scriptPath,
        [
            '--port=8080',
            `--config=${config}`,
            `--customWebpackPath=${customWebpackPath}`,
            `--mode=${mode}`
        ]
    )

    child.on('exit', code => {
        // console.log('子进程退出 ---> ', code)
        if (code) {
            // 若子进程退出码不为0(或null)，代表异常退出，主进程也会跟着退出，主进程也要退出
            // console.log('主进程退出 ---> ', code)
            process.exit(code)
        }
    })
}


const onChange = args => {
    logger.info(({
        prefix: 'runServer',
        message: 'configure file change, restarting...'
    }))
    child.kill()
    runServer(args)
}
const runWatcher = opts => {
    const { config = '' } = opts
    // 启动配置监听服务 -> chokidar
    const configPath = getConfigFilePath({ config })
    const watcher = chokidar.watch(configPath)
        .on('change', () => onChange(opts))
        .on('error', err => {
            logger.error({ prefix: 'configure file watch error', message:  err })
            process.exit(1)
        })
}

const startServer = (options, cmd) => {
    logger.info({ message: 'starting server...' })
    // 1.通过子进程启动webpack-dev-server
    // 1.1 子进程启动可以避免主进程受到影响
    // 1.2 子进程启动可以方便重启，解决webpack-dev-server配置修改无法自动重启
    runServer(options)

    // 2.监听配置修改
    runWatcher(options)
}

module.exports = {
    startServer
}