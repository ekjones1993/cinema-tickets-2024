import winston from 'winston';

let sessionId = null;

// Set sessionId for logging context
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
  transports: [new winston.transports.Console()],
});

export default logger;
