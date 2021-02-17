import { IPersonPet, IPerson } from '@app/interfaces';
import { Person } from '@app/models';
import knex from '../db_pg/knex-config';

const create = async (person: IPerson) => {
  const [createdPerson] = await knex<Person>('persons')
    .insert(person)
    .returning('*');

  return createdPerson;
};

const setPersonPet = async (personPet: IPersonPet) => {
  const _personPet = await knex('persons_pets')
    .insert(personPet)
    .returning('*');

  return !!_personPet;
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
  const deletedPerson = await knex<Person>('persons')
    .where({ id: personId })
    .del();

  return !!deletedPerson;
};

export const personRepository = {
  create,
  setPersonPet,
  getPaginated,
  getById,
  update,
  deleteById,
};
