
import fs from 'fs';
import path from 'path';
import pino from 'pino';

// Create log directory if missing
const logDir = path.resolve('./logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

// Define file paths
const allLogsFile = path.join(logDir, 'app.log');
const errorLogsFile = path.join(logDir, 'error.log');

// Define transports
const streams = [
  { stream: pino.destination(allLogsFile) },
  { level: 'error', stream: pino.destination(errorLogsFile) },
];

// Create logger
const logger = pino(
  {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    base: { app: 'nextjs-app', env: process.env.NODE_ENV },
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level(label) {
        return { level: label.toUpperCase() };
      },
    },
    serializers: {
      err: pino.stdSerializers.err, // logs full error stack trace
    },
    transport:
      process.env.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
  },
  pino.multistream(streams)
);

export default logger;
