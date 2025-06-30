#!/usr/bin/env node
const { Command } = require('commander')
const pkg = require('../package.json')
const { checkNode } = require('../lib/checkNode')
const { startServer } = require('../lib//start/startServer')
const { build } = require('../lib/build/index')
const { checkDebug } = require('../lib/utils/index')

/**
 * 检查是否是debug模式
 * 先检查 --debug/-d 参数，然后设置环境变量
 * 再加载logger模块，在logger模块中检查环境变量
 * 最后根据环境变量设置日志级别
 */
checkDebug();
require('../lib/utils/logger')

const MIN_NODE_VERSION = '20.0.0'

const program = new Command()

if (!checkNode(MIN_NODE_VERSION)) {

    const msg = `Please upgrade Node version to ${MIN_NODE_VERSION} or higher`
    throw new Error(msg)
}


program
    .name('c-build')
    .description('CLI to build a project')
    .version(pkg.version, '-v, --version', 'output the current version')

program
    .command('start')
    .description('Start the server by c-build')
    .option('--config <config>', 'config file path')
    .option('--custom-webpack-path <customWebpackPath>', 'customWebpack directory')
    .option('--mode <mode>', 'build mode', 'development')
    .option('-d, --debug [debug]', 'debug mode', false)
    .option('--stop-server', 'stop server', false)
    .allowUnknownOption()
    .action(startServer)

program
    .command('build')
    .description('Build the project by c-build')
    .option('--config <config>', 'config file path')
    .option('--custom-webpack-path <customWebpackPath>', 'customWebpack directory')
    .allowUnknownOption()
    .action(build)


program.parse(process.argv)
