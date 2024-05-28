import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf, colorize, align, errors } = format;

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    errors({ stack: true }),
    colorize({ all: true }),
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    align(),
    printf(
      (logInfo) => `[${logInfo.timestamp}] ${logInfo.level}: ${logInfo.message}`
    )
  ),
  transports: [new transports.Console()],
  exceptionHandlers: [new transports.Console()],
  rejectionHandlers: [new transports.Console()],
});

export default logger;
