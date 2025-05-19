const { program } = require('commander')
const { detectPort } = require('detect-port')
const { confirm  } = require('@inquirer/prompts')
const Service = require('../service/service')
const net = require('node:net')

;(async () => {
    const DEFAULT_PORT = '9001'

    program
        .option('--config <config>', 'config file path')
        .option('-p, --port <port>', 'port number', DEFAULT_PORT)
        .option('--customWebpackPath <customWebpackPath>')
        .option('--mode <mode>', 'build mode')
        .allowUnknownOption()
        .parse(process.argv);

    const { port, config, customWebpackPath, mode } = program.opts()

    try {

        const newPort = await detectPort(port)
        if (newPort !== parseInt(port)) {
            const answer = await confirm({
                message: `端口 ${port} 已被占用，是否启用新端口 ${newPort}`
            })
            if (!answer) {
                process.exit(1)
            }
        }

        const service = new Service({ port: newPort, config, customWebpackPath, mode })
        await service.start()

    } catch (error) {
        console.error(error)
    }
})()