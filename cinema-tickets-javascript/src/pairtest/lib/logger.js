// src/lib/logger.js
import winston from 'winston';

let sessionId = null; // Holds the sessionId for current logging context

// Function to set the sessionId for logging context
export const setSessionId = (newSessionId) => {
  sessionId = newSessionId;
};

// Winston logger setup
const logger = winston.createLogger({
  level: 'info',
  defaultMeta: { sessionId: () => sessionId || 'no-session-id' }, // sessionId set dynamically
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return `${timestamp} [${level}] [sessionId: ${sessionId}] ${message} ${JSON.stringify(meta)}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/ticket-service.log' }),
  ],
});

export default logger;
