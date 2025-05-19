const path = require('node:path')
const { pathToFileURL } = require('node:url')
const fg = require('fast-glob')
const fs = require("node:fs");

const DEFAULT_CONFIG_NAME = 'c-build.config.(js|cjs||mjs|json)'

function processPath(pathStr) {
    return path.isAbsolute(pathStr) ? pathStr : path.resolve(pathStr)
}

function judgeIfExists(pathStr, logInfo = '') {
    if (!(pathStr && fs.existsSync(pathStr))) {
        console.log(logInfo)
        return false
    }

    return true
}

function getConfigFilePath({ config = '', dir = process.cwd() }) {
    let configFilePath = ''
    if (config) {
        configFilePath = processPath(config)
    } else {
        const configFiles = fg.sync(
            [DEFAULT_CONFIG_NAME],
            {
                cwd: dir,
                absolute: true
            }).sort((a, b) => {
            // 定义优先级顺序
            const priority = { '.js': 1, '.cjs': 2, '.mjs': 3,  '.json': 4 }
            const extA = path.extname(a)
            const extB = path.extname(b)
            return priority[extA] - priority[extB]
        })
        // console.log(configFiles)
        configFilePath = configFiles[0]
    }
    return configFilePath
}

async function loadModule(moduleFilePath) {
    let module = null
    let loadPath = ''
    //  TODO: 支持JSON、CJS、MJS node_modules支持
    // get the type of the module file (module from node_modules vs. local module)
    // and process the load path
    const isNodeModule = !(moduleFilePath.startsWith('/') || moduleFilePath.startsWith('.'))
    if (isNodeModule) {
        loadPath = moduleFilePath
    } else {
        loadPath = processPath(moduleFilePath)
    }
    loadPath = require.resolve(loadPath, {
        paths: [
            path.resolve(process.cwd(), 'node_modules')
        ]
    })

    // get the file type
    const isMJSModule = loadPath.endsWith('.mjs')

    if (!judgeIfExists(loadPath, '模块不存在: ' + loadPath)) {
        return
    }

    if (isMJSModule) {
        const _module = await import(pathToFileURL(loadPath).href)
        module = _module.default
    } else {
        // console.log(loadPath)
        module = require(loadPath)
    }

    return module
}

module.exports = {
    getConfigFilePath,
    processPath,
    loadModule,
    judgeIfExists,
    DEFAULT_CONFIG_NAME
}