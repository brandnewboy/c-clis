#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')
const { parse } = require('./parseArgs')
const { getAuthStr } = require('./auth')
const { getFileType } = require('./fileType')
const { getFileUser } = require('./fileUser')
const { getFileSizeAndDate } = require('./getFileSizeAndDate')
const args = process.argv.slice(2)

const { isAll, isList } = parse(args)

let files = fs.readdirSync(process.cwd())
let output = ''

if (!isAll) {
    files = files.filter(file => !file.startsWith('.'))
}

if (!isList) {
    output = []
    files.forEach(file => {
        output.push(file)
    })
    console.table(output)
} else {
    files.forEach((file, index) => {
        if (index === files.length - 1) {
            output += file
        } else {
            output += file + '\n'
        }
    })
    // console.log(output)

    output = files.reduce((prev, file) => {
        const stat = fs.statSync(file)
        let subDirSize = 0
        if (stat.isDirectory()) {
            subDirSize = fs.readdirSync(file).length
        }
        /*
        16822 -> 0100 000 110 110 110
        16384 -> 0100 000 000 000 000
        33206 -> 1000 000 110 110 110
         */
        return prev
            + getFileType(stat.mode)
            + getAuthStr(stat.mode)
            + '\t' + subDirSize
            + '\t' + getFileUser(stat)
            + '\t' + getFileSizeAndDate(stat)
            + '\t' + file + '\n';

    }, '')
    console.log(output)
}

// Unix(Linux, macOS) 文件权限体系
// rwx: r: 读， w: 写， x: 执行
// u|g|o: user: 当前登录用户, group：当前登录用户所在组, other：其他用户
// Nodejs 如何获取文件类型和文件权限
// Unix使用32位二进制数存储文件类型和权限
// 0000 0000 0000 0000
// 0000(文件类型)  000(特殊权限) 000(用户权限) 000(分组权限) 000(其他权限)

// console.log(output)