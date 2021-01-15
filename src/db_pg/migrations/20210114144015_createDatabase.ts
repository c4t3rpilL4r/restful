import * as Knex from 'knex';
import config from '../../../knexfile';

const connectionConfig = config.connection as Knex.MySqlConnectionConfig;

export async function up(knex: Knex): Promise<any> {
  try {
    await knex.raw('SELECT 1+1 as result');
    // tslint:disable-next-line: no-console
    console.info(`Database ${connectionConfig.database} already exists.`);
  } catch {
    await knex.raw(`CREATE DATABASE ${connectionConfig.database}`);
    // tslint:disable-next-line: no-console
    console.info(`Database ${connectionConfig.database} created.`);
  }
}

export async function down(knex: Knex): Promise<any> {}
