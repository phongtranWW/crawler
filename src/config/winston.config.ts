import { registerAs } from '@nestjs/config';
import * as winston from 'winston';

export default registerAs('winston', () => ({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(
          ({ timestamp, level, message, content, context }) => {
            const stringifiedContent = JSON.stringify(content, null, 2);
            return `[${timestamp}] [${level}] [${context}] [${message}]: ${stringifiedContent}`;
          },
        ),
      ),
    }),
  ],
}));
