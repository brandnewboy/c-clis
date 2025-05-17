
const argsObj = {}

class Parser {
    name = ''
    flags = []
    action = null
    constructor(name, flags, action) {
        this.name = name
        this.flags = flags
        this.action = action
    }
}

const parser = [
    new Parser(
        'isAll',
        ['a', 'all'],
        ({ name, flags, args }) => {
            for(let i = 0; i < flags.length; i++) {
                if (args.includes(flags[i])) {
                    argsObj[name] = true
                    break
                }
            }
        }
    )
]

const register = _parser => {
    parser.push(_parser)
}

register(new Parser(
    'isList',
    ['l', 'list'],
    ({ name, flags, args }) => {
        for(let i = 0; i < flags.length; i++) {
            if (args.includes(flags[i])) {
                argsObj[name] = true
                break
            }
        }
    }
))


const init = () => {
    parser.forEach(({ name }) => {
        Object.defineProperty(argsObj, name, {
            value: false,
            writable: true,
            enumerable: true,
            configurable: true,
        })
    })
}

init()


const parse = args => {
    args = args.reduce((prev, cur) => {
        return prev + cur
    }, '')
    parser.forEach(({ name, flags, action }) => {
        action({ name, flags, args })
    })

    return { ...argsObj }
}


module.exports = {
    parse,
    register,
    Parser
}