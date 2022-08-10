// Update with your config settings.

import config from './config.js';

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export const development = {
  client: config.DB_CONNECTION || 'mysql',
  connection: {
    host: config.DB_HOST || '127.0.0.1',
    port: config.DB_PORT || 3306,
    user: config.DB_USERNAME || 'root',
    password: config.DB_PASSWORD || '',
    database: config.DB_DATABASE || 'default',
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};
export const staging = {
  client: 'postgresql',
  connection: {
    database: 'my_db',
    user: 'username',
    password: 'password'
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};
export const production = {
  client: 'postgresql',
  connection: {
    database: 'my_db',
    user: 'username',
    password: 'password'
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};
