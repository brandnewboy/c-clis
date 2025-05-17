#!/usr/bin/env node
const {
    Command,
    Option,
    InvalidOptionArgumentError,
    Argument
} = require('commander')


const pkg = require('../package.json')

const program = new Command()
/**
 * options的调用方式
 * 1. -s <char>
 * 2. -s<char>
 * 3. --separator <char>
 * 4. --separator=<char>
 */
program
    .name('test-name')
    .description('CLI to generate a project')
    .version(pkg.version, '-v, --version' , 'output the current version')

// 全局选项
program
    .hook('preAction', (thisCommand, actionCommand) => {
        console.log('actionCommand === thisCommand', actionCommand === thisCommand)
        console.log('program === thisCommand', program === thisCommand)
        console.log('global preAction')
    })
    .hook('postAction', (thisCommand, actionCommand) => {
        console.log('actionCommand === thisCommand', actionCommand === thisCommand)
        console.log('program === thisCommand', program === thisCommand)
        console.log('global postAction')
    })
    .option('-d, --debug', 'output extra debugging')
    .option('-g, --global [string]', 'global option', 'test global')

// 子命令
program
    .command('split')
    .description('split some substring from another string')
    .argument('<string>', 'string to split')
    .option('-f, --first')
    .requiredOption('-s, --separator <char>', 'separator character')
    .option('-e, --extra', 'extra for something')
    .option('-a, --add [string]', 'add something', 'default add')
    .option('-l, --letters <letters...>', 'some letters')
    .action((args, options, cmd) => {
        // console.log(firstArg)
        // console.log(secondArg.optsWithGlobals())
        // console.log(secondArg.getOptionValue('separator'))

        console.log(args)
        console.log(cmd.optsWithGlobals())
        const limit = options.first ? 1 : undefined
        const str = args.split(options.separator, limit)//.push(options.add)
        str.push(options.add)
        console.log('split result is ===> ', str)
        console.log('letters result is ===> ', options.letters)
    })


// Option
program
    .command('test')
    .addOption(new Option('-s, --select', 'select something').hideHelp())
    .addOption(
        new Option('-t, --timeout <dely>', 'timeout')
            .default(10, '10 seconds')
    )
    .addOption(
        new Option('-c --choice <c>', 'your choice')
            .choices(['small', 'medium', 'large', 'huge'])
    )
    .addOption(
        new Option('-p, --port <port>', 'port number')
           .env('PORT')
    )
    .addOption(
        new Option('--donate [amount]', 'donation to charity')
            .preset('20')
            .argParser(parseFloat)
    )
    .addOption(
        new Option('--disable-server', 'disable server')
            .conflicts(['port', 'choice']) // 与前面的port option 互斥
    )
    .action((options, cmd) => {
        console.log(options)
        console.log(cmd.optsWithGlobals())
    });

// custom args parser 可以自定义参数处理函数
const myParseInt = value => {
    const parsedValue = parseInt(value, 10)
    if(isNaN(parsedValue)) {
        throw new InvalidOptionArgumentError('Not a number')
    }
    return parsedValue
}

const collectOptions = (value, previous) => {
    return previous.concat([value])
}
const increasedOptions = (value, previous) => {
    return +value + (previous || 0)
}
program
    .command('custom')
    .option('-f, --float <number>', 'float number', myParseInt)
    .option('--verbose, <number>', 'verbose', increasedOptions)
    .option('--collect <value>', 'collect', collectOptions, [])
    .action((args, cmd) => {
        console.log(cmd.optsWithGlobals())
    })

// Argument
program
   // .command('login <username> [password]', { hidden: true, isDefault: true })
    .command('login', { hidden: false, isDefault: true })
    .description('a command')
    // .argument('<username>', 'login username')
    // .argument('[password]', 'login password', 'no password')
    // .argument('<dir...>', 'directories test')
    // .arguments('<username> [password]')
    .addArgument(
        new Argument('<username>','login username')
            .argRequired()
            .choices(['zl', 'zladmin'])
    )
    .addArgument(
        new Argument('[password]','password')
        .argOptional()
        .default('no password', 'login password')
        .argParser(parseInt)
    )
    .option('-f','force login')
    .hook('preAction', (thisCommand, actionCommand) => {
        // console.log('actionCommand === thisCommand', actionCommand === thisCommand)
        console.log('preAction')
    })
    .hook('postAction', (thisCommand, actionCommand) => {
        // console.log('actionCommand === thisCommand', actionCommand === thisCommand)
        console.log('postAction')
    })
    .action(function (username, password, options, cmd)  {
        // console.log(username, password, options, cmd.optsWithGlobals())
        console.log(this.args, this.opts(), 'login commander action is executing......')
    })

program.parse()
