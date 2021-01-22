import { Pagination, Person } from '@app/models';
import knex from '../db_pg/knex-config';

const create = async (person: Person) => {
  return await knex('person').insert(person).returning('*');
};

const getAll = async () => {
  return await knex('person').select();
};

const getByPage = async (pagination: Pagination) => {
  return await knex('person')
    .select()
    .offset((pagination.page - 1) * pagination.limit)
    .limit(pagination.limit);
};

const getById = async (personId: number) => {
  return await knex('person').where({ id: personId });
};

const update = async (person: Person) => {
  return await knex('person')
    .where({ id: person.id })
    .update(person)
    .returning('*');
};

const deleteById = async (personId: number) => {
  return await knex('person').where({ id: personId }).del();
};

export const personRepository = {
  create,
  getAll,
  getByPage,
  getById,
  update,
  deleteById,
};
