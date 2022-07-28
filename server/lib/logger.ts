import pino from 'pino';
const logger = pino({
  name: 'example-application'
});

export default logger;