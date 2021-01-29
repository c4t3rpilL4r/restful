import { Person } from '@app/models';
import knex from '../db_pg/knex-config';

const create = async (person: Person) => {
  return await knex('person').insert(person).returning('*');
};

const getAll = async (page: number, limit: number) => {
  const query = knex('person');

  if (page && limit) {
    query.offset((page - 1) * limit).limit(limit);
  }

  return await query.select();
};

const getById = async (personId: number) => {
  return await knex('person').where({ id: personId });
};

const getByPetId = async (petId: number) => {
  return await knex('pet_owner')
    .where({ petId })
    .join('person', { ownerId: 'person.id' })
    .select('person.id', 'person.firstName', 'person.lastName');
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
  getById,
  getByPetId,
  update,
  deleteById,
};
