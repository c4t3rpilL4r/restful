import { IPet } from '@app/interfaces';
import { Pet, PersonPet } from 'src/db_pg/models';
import knex from '../db_pg/knex-config';

const create = async (pet: IPet) => {
  return await knex<Pet>('pet').insert(pet).returning('*');
};

const addOwnerToPet = async (personPet: PersonPet) => {
  const newPetOwner = await knex('person_pet').insert(personPet).returning('*');

  return await knex('person_pet')
    .where({
      ownerId: newPetOwner[0].ownerId,
      petId: newPetOwner[0].petId,
    })
    .select('ownerId')
    .join('pet', { petId: 'pet.id' })
    .select('pet.id', 'pet.name')
    .join('animal', { animalId: 'animal.id' })
    .select('animal.type');
};

const getAll = async (page?: number, limit?: number) => {
  const query = knex('pet');

  if (page && limit) {
    query.offset((page - 1) * limit).limit(limit);
  }

  return await query
    .join('animal', { animalId: 'animal.id' })
    .select('pet.id', 'pet.name', 'animal.type');
};

const getAllIncludingOwnerId = async (page?: number, limit?: number) => {
  const query = knex('person_pet');

  if (page && limit) {
    query.offset((page - 1) * limit).limit(limit);
  }

  return await query
    .select('ownerId')
    .join('pet', { petId: 'pet.id' })
    .select('pet.id', 'pet.name')
    .join('animal', { animalId: 'animal.id' })
    .select('animal.type');
};

const getByOwnerId = async (ownerId: number, page?: number, limit?: number) => {
  const query = knex<PersonPet>('person_pet');

  if (page && limit) {
    query.offset((page - 1) * limit).limit(limit);
  }

  return await query.where({ ownerId }).select('petId');
};

const getById = async (petId: number) => {
  return await knex<Pet>('pet').where({ id: petId }).select('*');
};

const update = async (pet: Pet) => {
  const query = knex<Pet>('pet');

  const updatedPet = await query
    .where({ id: pet.id })
    .update(pet)
    .returning('*');

  return await query
    .where({ id: updatedPet[0].id })
    .join('animal', { animalId: 'animal.id' })
    .select('pet.id', 'pet.name', 'animal.type');
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
  getAllIncludingOwnerId,
  getByOwnerId,
  getById,
  update,
  deleteById,
  deleteOwnership,
};
