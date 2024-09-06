import winston from 'winston';
import 'winston-daily-rotate-file';

// Create a daily rotate file transport for log rotation
const transport = new winston.transports.DailyRotateFile({
    filename: 'logs/edu-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true, // Compress old log files
    maxSize: '20m',      // Maximum size of a log file
    maxFiles: '10d'      // Keep logs for 14 days
});

// Create a logger instance
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        transport,
        new winston.transports.Console()
    ],
});

// Export the logger instance
export default logger;
