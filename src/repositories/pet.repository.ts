import { Pet, PersonPet } from '@app/models';
import knex from '../db_pg/knex-config';

const create = async (pet: Pet) => {
  const newPet = await knex('pet').insert(pet).returning('*');

  return await knex('pet')
    .where({ 'pet.id': newPet[0].id })
    .join('animal', { animalId: 'animal.id' })
    .select('pet.id', 'pet.name', 'animal.type');
};

const addOwnerToPet = async (personPet: PersonPet) => {
  const newPetOwner = await knex('pet_owner')
    .insert({ ownerId: personPet.owner.id, petId: personPet.pet.id })
    .returning('*');

  return await knex('pet_owner')
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
  const query = knex('pet_owner');

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

const getByOwnerId = async (
  ownerId: number,
  includeOwnerId?: boolean,
  page?: number,
  limit?: number,
) => {
  const query = knex('pet_owner');

  if (page && limit) {
    query.offset((page - 1) * limit).limit(limit);
  }

  if (includeOwnerId) {
    query.select('ownerId');
  }

  return await query
    .where({ ownerId })
    .join('pet', { petId: 'pet.id' })
    .select('pet.id', 'pet.name')
    .join('animal', { animalId: 'animal.id' })
    .select('pet.id', 'pet.name', 'animal.type');
};

const getById = async (petId: number) => {
  return await knex<Pet>('pet')
    .where({ id: petId })
    .join('animal', { animalId: 'animal.id' })
    .select('pet.id', 'pet.name', 'animal.type');
};

const update = async (pet: Pet) => {
  const updatedPet = await knex('pet')
    .where({ id: pet.id })
    .update(pet)
    .returning('*');

  return await knex('pet')
    .where({ 'pet.id': updatedPet[0].id })
    .join('animal', { animalId: 'animal.id' })
    .select('pet.id', 'pet.name', 'animal.type');
};

const deleteById = async (petId: number) => {
  await knex('pet_owner').where({ petId }).del();
  return await knex('pet').where({ id: petId }).del();
};

const deleteByOwnerId = async (ownerId: number) => {
  const petIds = await knex('pet_owner').where({ ownerId }).select('petId');

  await knex('pet_owner').where({ ownerId }).del();

  return await knex('pet').whereIn('id', petIds);
};

const deletePetAndOwner = async (petId: number, ownerId: number) => {
  console.log('inside');
  return await knex('pet_owner').where({ petId, ownerId }).del();
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
  deleteByOwnerId,
  deletePetAndOwner,
};
