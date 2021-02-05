import { IPerson } from '@app/interfaces';
import { Person } from '@app/models';
import knex from '../db_pg/knex-config';

const create = async (person: IPerson) => {
  const [newPerson] = await knex<Person>('persons')
    .insert(person)
    .returning('*');

  return newPerson;
};

const getPaginated = async (page: number, limit: number) => {
  const result = await knex<Person>('persons')
    .select('*')
    .offset((page - 1) * limit)
    .limit(limit)
    .orderBy('id');

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
  getPaginated,
  getById,
  update,
  deleteById,
};
