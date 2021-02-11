import { IPetOwnership, IPerson } from '@app/interfaces';
import { Person } from '@app/models';
import knex from '../db_pg/knex-config';

const create = async (person: IPerson) => {
  const [createdPerson] = await knex<Person>('persons')
    .insert(person)
    .returning('*');

  return createdPerson;
};

const doPetOwnership = async (personPet: IPetOwnership) => {
  const [petOwnership] = await knex('persons_pets')
    .insert(personPet)
    .returning('*');

  return !!petOwnership;
};

const getPaginated = async (page: number, limit: number) => {
  const result = await knex<Person>('persons')
    .select('*')
    .offset((page - 1) * limit)
    .limit(limit);

  return result;
};

const getById = async (personId: number) => {
  const person = await knex<Person>('persons')
    .where({ id: personId })
    .first('*');

  return person;
};

const update = async (person: Person) => {
  const [updatedPerson] = await knex<Person>('persons')
    .where({ id: person.id })
    .update(person)
    .returning('*');

  return updatedPerson;
};

const deleteById = async (personId: number) => {
  const isDeleted = await knex<Person>('persons').where({ id: personId }).del();

  return !!isDeleted;
};

export const personRepository = {
  create,
  doPetOwnership,
  getPaginated,
  getById,
  update,
  deleteById,
};
