import knex from '../db_pg/knex-config';

const create = async <T>(tableName: string, data: T) => {
  return await knex(tableName).insert(data).returning<T>('*');
};
