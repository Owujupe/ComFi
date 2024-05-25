import { createLogger, format, transports } from 'winston';


const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => `${timestamp} [${label}] ${label}: ${message}`)

const logger = createLogger({
    format: combine(label({ label: 'right meow', message: false }), timestamp(), myFormat),
    transports: [new transports.Console()]
})


logger.log({
    level: 'info',
    message: 'What time the testing at?'
})