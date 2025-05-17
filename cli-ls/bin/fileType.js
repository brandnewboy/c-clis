const fs = require('node:fs')

const getFileType = mode => {
    const isDir = mode & fs.constants.S_IFDIR
    const isFile = mode & fs.constants.S_IFREG
    const isLink = mode & fs.constants.S_IFLNK

    if (isDir) {
        return 'd'
    }

    if (isFile) {
        return '-'
    }

    if (isLink) {
        return 'l'
    }

    return '-'
}

module.exports = {
    getFileType
}