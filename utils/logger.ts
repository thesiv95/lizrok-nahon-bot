import { createLogger, format, transports } from 'winston';
const { combine, splat, printf } = format;

const myFormat = printf( ({ level, message }) => `[${level}] : ${message}`);

const logger = createLogger({
  level: 'debug',
  format: combine(
	format.colorize(),
	splat(),
	myFormat
  ),
  transports: [
	new transports.Console({ level: 'debug' }),
  ]
});
export default logger;