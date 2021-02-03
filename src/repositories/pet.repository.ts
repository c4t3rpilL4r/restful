import { IPet } from '@app/interfaces';
import { Pet, PersonPet } from 'src/db_pg/models';
import knex from '../db_pg/knex-config';

const create = async (pet: IPet) => {
  return await knex<Pet>('pet').insert(pet).returning('*');
};

const addOwnerToPet = async (personPet: PersonPet) => {
  return await knex<PersonPet>('person_pet').insert(personPet).returning('*');
};

const getAll = async (page?: number, limit?: number) => {
  const query = knex<Pet>('pet');

  if (page && limit) {
    query.offset((page - 1) * limit).limit(limit);
  }

  return await query.select('*');
};

const getByOwnerId = async (ownerId: number, page?: number, limit?: number) => {
  const query = knex<Pet>('pet');

  if (page && limit) {
    query.offset((page - 1) * limit).limit(limit);
  }

  const petIDs = await knex('person_pet')
    .where({ ownerId })
    .select(knex.ref('petId').as('id'));
  const listOfPetIDs = petIDs.map((x) => x.id);

  return await query.whereIn('id', listOfPetIDs);
};

const getById = async (petId: number) => {
  return await knex<Pet>('pet').where({ id: petId }).select('*');
};

const update = async (pet: Pet) => {
  return await knex<Pet>('pet')
    .where({ id: pet.id })
    .update(pet)
    .returning('*');
};

const deleteById = async (petId: number) => {
  await knex('person_pet').where({ petId }).del();
  return await knex('pet').where({ id: petId }).del();
};

const deleteOwnership = async (ownerId: number, petId?: number) => {
  const query = knex('person_pet');

  if (petId) {
    query.where({ ownerId, petId }).del();
  } else {
    query.where({ ownerId }).del();
  }

  return await query;
};

export const petRepository = {
  create,
  addOwnerToPet,
  getAll,
  getByOwnerId,
  getById,
  update,
  deleteById,
  deleteOwnership,
};
