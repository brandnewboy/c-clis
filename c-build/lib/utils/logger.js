const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label, printf, colorize, simple } = format

let logger = createLogger({
        format: combine(
            colorize({ all: true }),
            simple(),
            label({ label: 'c-build' }),
            timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            printf((o) => {
                const { level, message, prefix, label, timestamp } = o

                const msg = message instanceof Object ? JSON.stringify(message) : message
                return `${timestamp} [${label} - ${prefix || 'tips'}] ${level}: ${msg}`;
            })
        ),
        transports: [
            new transports.Console({ level: process.env.__C_BUILD_IS_DEBUG__ ? 'debug' : 'info' })
        ]
    })


module.exports = logger

/**
 * {
 *   error: 0,
 *   warn: 1,
 *   info: 2,
 *   http: 3,
 *   verbose: 4,
 *   debug: 5,
 *   silly: 6
 * }
 */