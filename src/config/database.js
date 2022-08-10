import knex from 'knex';
import config from '../config.js';

const db = knex({
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
});

export default db;