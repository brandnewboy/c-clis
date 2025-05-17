#!/usr/bin/env node
const { Command } = require('commander')
const pkg = require('../package.json')
const { checkNode } = require('../lib/checkNode')
const { startServer } = require('../lib//start/startServer')


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
    .description('Start the project')
    .action(startServer)

program.parse()
