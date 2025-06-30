const Service = require('../service/service')
function build(options, cmd) {
    process.env.C_BUILD_MODE = 'production'
    const service = new Service({
        ...options
    })
    service.build().then(() => {})
}


module.exports = {
    build
}