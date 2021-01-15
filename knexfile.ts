import { Config, MySqlConnectionConfig } from 'knex';

const connectionConfig: MySqlConnectionConfig = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'postgres',
};

const config: Config = {
  client: 'pg',
  connection: connectionConfig,
  useNullAsDefault: true,
  migrations: { directory: './src/db_pg/migrations' },
};

export default config;
module.exports = config;
