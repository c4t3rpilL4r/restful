import { IPerson } from '@app/interfaces';
import { Person, PersonPet } from 'src/db_pg/models';
import knex from '../db_pg/knex-config';

const create = async (person: IPerson) => {
  return await knex<Person>('person').insert(person).returning('*');
};

const getAll = async (page?: number, limit?: number) => {
  const query = knex<Person>('person');

  if (page && limit) {
    query.offset((page - 1) * limit).limit(limit);
  }

  return await query.select('*');
};

const getPetOwners = async (page?: number, limit?: number) => {
  const query = knex<PersonPet>('person_pet');

  if (page && limit) {
    query.offset((page - 1) * limit).limit(limit);
  }

  return await query
    .distinct('ownerId')
    .join('person', { ownerId: 'person.id' })
    .select('person.firstName', 'person.lastName');
};

const getByPetId = async (petId: number) => {
  return await knex('person_pet')
    .where({ petId })
    .join('person', { ownerId: 'person.id' })
    .select('person.id', 'person.firstName', 'person.lastName');
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
  await knex('person_pet').where({ ownerId: personId }).del();
  return await knex('person').where({ id: personId }).del();
};

export const personRepository = {
  create,
  getAll,
  getPetOwners,
  getByPetId,
  getById,
  update,
  deleteById,
};
