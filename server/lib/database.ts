import { DataSource } from 'typeorm';
import config from './config';
import logger from './logger';

if (!config.database.host) {
  logger.fatal('Missing database host');
  process.exit(1);
}

if (!config.database.port) {
  logger.fatal('Missing database port');
  process.exit(1);
}

if (!config.database.username) {
  logger.fatal('Missing database username');
  process.exit(1);
}

if (!config.database.password) {
  logger.fatal('Missing database password');
  process.exit(1);
}

if (!config.database.database) {
  logger.fatal('Missing database name');
  process.exit(1);
}

const applicationDs = new DataSource({
  type: 'mariadb',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  entities: ['src/entity/*.js'],
  migrations: ['src/migrations/*.js']
});

export default applicationDs;