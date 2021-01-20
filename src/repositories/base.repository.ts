import knex from '../db_pg/knex-config';

const create = async <T>(tableName: string, data: T) => {
  return await knex('person').insert(data).returning<T>('*');
};
