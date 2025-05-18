class Service {
    constructor(options) {
        this.options = options
    }
    start() {
        console.log('启动服务')
    }
}

module.exports = Service