import { IPet } from '@app/interfaces';
import { Pet, PersonPet } from 'src/db_pg/models';
import knex from '../db_pg/knex-config';

const create = async (pet: IPet) => {
  const newPet = await knex<Pet>('pet').insert(pet).returning('*');

  return await knex<Pet>('pet').where({ id: newPet[0].id }).first('*');
};

const addOwnerToPet = async (personPet: PersonPet) => {
  return await knex<PersonPet>('person_pet').insert(personPet).returning('*');
};

const getAll = async (page?: number, limit?: number) => {
  const query = knex<Pet>('pet');

  if (page && limit) {
    query.offset((page - 1) * limit).limit(limit);
  }

  return await query.orderBy('id');
};

const getByOwnerId = async (ownerId: number, page?: number, limit?: number) => {
  const query = knex<Pet>('pet');

  if (page && limit) {
    query.offset((page - 1) * limit).limit(limit);
  }

  const petIDs = await knex('person_pet').where({ ownerId }).select('petId');
  const listOfPetIDs = petIDs.map((x) => x.petId);

  return await query.whereIn('id', listOfPetIDs).orderBy('id');
};

const getById = async (petId: number) => {
  return await knex<Pet>('pet').where({ id: petId }).first('*');
};

const update = async (pet: Pet) => {
  const updatedPet = await knex<Pet>('pet')
    .where({ id: pet.id })
    .update(pet)
    .returning('*');

  return await knex<Pet>('pet').where({ id: updatedPet[0].id }).first('*');
};

const deleteById = async (petId: number) => {
  await knex('person_pet').where({ petId }).del();
  const isDeleted = await knex('pet').where({ id: petId }).del();

  return !!isDeleted;
};

const deleteOwnership = async (ownerId: number, petId?: number) => {
  const query = knex('person_pet');
  let isDeleted: boolean;

  if (petId) {
    isDeleted = await query.where({ ownerId, petId }).del();
  } else {
    isDeleted = await query.where({ ownerId }).del();
  }

  return !!isDeleted;
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
