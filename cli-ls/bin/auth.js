const fs = require('node:fs')
// Unix(Linux, macOS) 文件权限体系
// rwx: r: 读， w: 写， x: 执行
// u|g|o: user: 当前登录用户, group：当前登录用户所在组, other：其他用户
// Nodejs 如何获取文件类型和文件权限
// Unix使用32位二进制数存储文件类型和权限
// 0000 0000 0000 0000
// 0000(文件类型)  000(特殊权限) 000(用户权限) 000(分组权限) 000(其他权限)
const getAuthStr = mode => {
    let authStr = ''

    // usr
    const canUserRead = mode & fs.constants.S_IRUSR
    const canUserWrite = mode & fs.constants.S_IWUSR
    const canUserExec = mode & fs.constants.S_IXUSR
    authStr += canUserRead ? 'r' : '-'
    authStr += canUserWrite ? 'w' : '-'
    authStr += canUserExec ? 'x' : '-'
    // group
    const canGroupRead = mode & fs.constants.S_IRGRP
    const canGroupWrite = mode & fs.constants.S_IWGRP
    const canGroupExec = mode & fs.constants.S_IXGRP
    // console.log('group', canGroupExec, canGroupWrite, canGroupExec, fs.constants)
    authStr += canGroupRead ? 'r' : '-'
    authStr += canGroupWrite? 'w' : '-'
    authStr += canGroupExec? 'x' : '-'
    // other
    const canOtherRead = mode & fs.constants.S_IROTH
    const canOtherWrite = mode & fs.constants.S_IWOTH
    const canOtherExec = mode & fs.constants.S_IXOTH
    authStr += canOtherRead ? 'r' : '-'
    authStr += canOtherWrite ? 'w' : '-'
    authStr += canOtherExec? 'x' : '-'
    return authStr
}

module.exports = {
    getAuthStr
}