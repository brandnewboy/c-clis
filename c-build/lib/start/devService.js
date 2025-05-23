const { program } = require('commander')
const { detectPort } = require('detect-port')
const { confirm  } = require('@inquirer/prompts')
const Service = require('../service/service')
const net = require('node:net')

;
const logger = require("../utils/logger");
(async () => {
    const DEFAULT_PORT = '9001'

    program
        .option('--config <config>', 'config file path')
        .option('-p, --port <port>', 'port number', DEFAULT_PORT)
        .option('--customWebpackPath <customWebpackPath>')
        .option('--mode <mode>', 'build mode')
        .option('--stopServer <stopServer>', 'stop server')
        .allowUnknownOption()
        .parse(process.argv);

    const { port } = program.opts()

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

        const service = new Service({
            ...program.opts(),
            port: newPort,
            stopServer: program.opts().stopServer === 'true',
        })
        await service.start().then(() => {
            logger.info({
                prefix: 'devService',
                message: `devService executing completed!`,
            })
        })

    } catch (error) {
        logger.info({
            prefix: 'devService executing failed!',
            message: error.message,
        })
    }
})()