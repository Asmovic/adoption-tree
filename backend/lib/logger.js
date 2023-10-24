const winston = require("winston");
const { combine, timestamp, label, printf } = winston.format;

const logFormat = printf((info) => {
  let line = `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
  line += "\n";
  const stack = info.stack;
  if (stack) {
    line += ` ${stack}`;
  }

  return line;
});

const logger = winston.createLogger({
  format: combine(
    label({
      label: process.env.APP_NAME,
    }),
    timestamp(),
    logFormat
  ),
  //   format: winston.format.json()
});
const logConsole = new winston.transports.Console();

logger.add(logConsole);

module.exports = logger;
