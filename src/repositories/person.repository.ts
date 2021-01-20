import { Person } from '@app/models';
import knex from '../db_pg/knex-config';

const create = async (person: Person) => {
  return await knex('person').insert(person).returning('*');
};

const get = async () => {
  return await knex('person').select();
};

const getByPage = async (page: number, limit: number) => {
  return await knex('person')
    .select()
    .offset((page - 1) * limit)
    .limit(limit);
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
  await knex('pet_owner').where({ ownerId: personId }).del();
  return await knex('person').where({ id: personId }).del();
};

export const personRepository = {
  create,
  get,
  getByPage,
  getById,
  update,
  deleteById,
};
