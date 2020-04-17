import path from 'path';
import { Options } from 'morgan';
import { config } from '../config';
import { createLogger, format, transports } from 'winston';

const production = config.environment == 'production';

const customFormat = format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`); // const customFormat = format.printf(info => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`);

const logger = createLogger({
  level: production ? 'error' : 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.splat(),
    format.json(),
    format.errors({ stack: true }),
    customFormat,
  ),
  // defaultMeta: {
  //   service: config.tenant.name
  // },
  transports: [
    new transports.File({ filename: path.join(__dirname, '../logs/error.log'), level: 'error' }),
    new transports.File({ filename: path.join(__dirname, '../logs/info.log'), level: 'info' })
  ]
});

const morganOption: Options = {
  stream: {
    write: (message: string) => {
      logger.info(message.trim());
    },
  },
};

if (!production) {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        customFormat // format.simple(),
      )
    })
  );
}

export {
  logger,
  morganOption
}