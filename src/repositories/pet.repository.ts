import { Pet } from '@app/models';
import knex from '../db_pg/knex-config';

const query = knex('pet');

const create = async (pet: Pet) => {
  return await query.insert(pet).returning('*');
};

const getAll = async (page: number, limit: number) => {
  if (page && limit) {
    query.offset((page - 1) * limit).limit(limit);
  }

  return await query
    .select('pet.id', 'pet.name')
    .join('animal', { animalId: 'animal.id' })
    .select('animal.type');
};

const getById = async (petId: number) => {
  return await query
    .where({ 'pet.id': petId })
    .select('pet.id', 'pet.name')
    .join('animal', { animalId: 'animal.id' })
    .select('animal.type');
};

const update = async (pet: Pet) => {
  const updatedPet = await query
    .where({ id: pet.id })
    .update(pet)
    .returning('*');

  return await query
    .where({ 'pet.id': updatedPet[0].id })
    .select('pet.id', 'pet.name')
    .join('animal', { animalId: 'animal.id' })
    .select('animal.type');
};

const deleteById = async (petId: number) => {
  return await query.where({ id: petId }).del();
};

export const petRepository = {
  create,
  getAll,
  getById,
  update,
  deleteById,
};
