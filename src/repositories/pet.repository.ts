import { Pet } from '@app/models';
import knex from '../db_pg/knex-config';

const create = async (pet: Pet) => {
  const newPet = await knex('pet').insert(pet).returning('*');

  return await knex('pet')
    .where({ 'pet.id': newPet[0].id })
    .join('animal', { animalId: 'animal.id' })
    .select('pet.id', 'pet.name', 'animal.type');
};

const getAll = async (page: number, limit: number) => {
  const query = knex('pet');

  if (page && limit) {
    query.offset((page - 1) * limit).limit(limit);
  }

  return await query
    .join('animal', { animalId: 'animal.id' })
    .select('pet.id', 'pet.name', 'animal.type');
};

const getById = async (petId: number) => {
  return await knex('pet')
    .where({ 'pet.id': petId })
    .join('animal', { animalId: 'animal.id' })
    .select('pet.id', 'pet.name', 'animal.type');
};

const getByOwnerId = async (ownerId: number) => {
  return await knex('pet_owner')
    .where({ ownerId })
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
  return await knex('pet').where({ id: petId }).del();
};

export const petRepository = {
  create,
  getAll,
  getById,
  getByOwnerId,
  update,
  deleteById,
};
