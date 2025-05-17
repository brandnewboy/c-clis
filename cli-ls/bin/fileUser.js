const fs = require('node:fs')

const getFileUser = stat => {


    return stat.uid + ' ' + stat.gid
}

module.exports = {
    getFileUser
}