import { Pet, PetOwner } from '@app/models';
import knex from '../db_pg/knex-config';

const create = async (pet: Pet) => {
  return await knex('pet').insert(pet).returning('*');
};

const get = async () => {
  return await knex('pet')
    .join('animal', { animalId: 'animal.id' })
    .select('pet.id', 'pet.name', 'animal.type');
};

const getByPage = async (page: number, limit: number) => {
  return await knex('pet')
    .join('animal', { animalId: 'animal.id' })
    .select('pet.id', 'pet.name', 'animal.type')
    .offset((page - 1) * limit)
    .limit(limit);
};

const getById = async (petId: number) => {
  return await knex('pet')
    .where({ id: petId })
    .join('animal', { animalId: 'animal.id' })
    .select('pet.id', 'pet.name', 'animal.type');
};

const getByOwner = async (ownerId: number) => {
  const pets = await knex('pet_owner')
    .where({ ownerId })
    .join('animal', { animalId: 'animal.id' })
    .select('pet.id', 'pet.name', 'animal.type');
};

const getByOwnerWithLimit = async (
  ownerId: number,
  page: number,
  limit: number,
) => {
  return await knex('pet')
    .where({ ownerId })
    .join('animal', { animalId: 'animal.id' })
    .select('pet.id', 'pet.name', 'animal.type')
    .offset((page - 1) * limit)
    .limit(limit);
};

const update = async (pet: Pet) => {
  return await knex('pet').where({ id: pet.id }).update(pet).returning('*');
};

const deleteById = async (petId: number) => {
  return await knex('pet').where({ id: petId }).del();
};

export const petRepository = {
  create,
  get,
  getByPage,
  getById,
  getByOwner,
  getByOwnerWithLimit,
  update,
  deleteById,
};
