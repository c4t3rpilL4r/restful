import { IPerson } from '@app/interfaces';
import { Person } from '@app/models';
import knex from '../db_pg/knex-config';

const create = async (person: IPerson) => {
  const newPerson = await knex<Person>('person').insert(person).returning('*');

  return await knex<Person>('person').where({ id: newPerson[0].id }).first('*');
};

const getAll = async (page?: number, limit?: number) => {
  const query = knex<Person>('person');

  if (page && limit) {
    query.offset((page - 1) * limit).limit(limit);
  }

  return await query.orderBy('id');
};

const getPetOwners = async (page?: number, limit?: number) => {
  const query = knex<Person>('person');

  if (page && limit) {
    query.offset((page - 1) * limit).limit(limit);
  }

  const ownerIDs = await knex('person_pet').distinct('ownerId');
  const listOfOwnerIDs = ownerIDs.map((x) => x.ownerId);

  return await query.whereIn('id', listOfOwnerIDs).orderBy('id');

  // return await query.whereIn(
  //   'id',
  //   await knex('person_pet').select(knex.ref('ownerId').as('id')),
  // );
};

const getByPetId = async (petId: number) => {
  const ownerIDs = await knex('person_pet').where({ petId }).select('ownerId');
  const listOfOwnerIDs = ownerIDs.map((x) => x.ownerId);

  return await knex<Person>('person').whereIn('id', listOfOwnerIDs);
};

const getById = async (personId: number) => {
  return await knex<Person>('person').where({ id: personId }).first('*');
};

const update = async (person: Person) => {
  const updatedPerson = await knex<Person>('person')
    .where({ id: person.id })
    .update(person)
    .returning('*');

  return await knex<Person>('person')
    .where({ id: updatedPerson[0].id })
    .first('*');
};

const deleteById = async (personId: number) => {
  await knex('person_pet').where({ ownerId: personId }).del();
  const isDeleted = await knex('person').where({ id: personId }).del();

  return !!isDeleted;
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
