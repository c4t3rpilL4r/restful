import { Pet, Pagination } from '@app/models';
import knex from '../db_pg/knex-config';

const create = async (pet: Pet) => {
  return await knex('pet').insert(pet).returning('*');
};

const getAll = async () => {
  return await knex('pet')
    .join('animal', { animalId: 'animal.id' })
    .select('pet.id', 'pet.name', 'animal.type');
};

const getByPage = async (pagination: Pagination) => {
  return await knex('pet')
    .join('animal', { animalId: 'animal.id' })
    .select('pet.id', 'pet.name', 'animal.type')
    .offset((pagination.page - 1) * pagination.limit)
    .limit(pagination.limit);
};

const getById = async (petId: number) => {
  return await knex('pet')
    .where({ 'pet.id': petId })
    .select('pet.id', 'pet.name')
    .join('animal', { animalId: 'animal.id' })
    .select('animal.type');
};

const update = async (pet: Pet) => {
  const updatedPet = await knex('pet')
    .where({ id: pet.id })
    .update(pet)
    .returning('*');

  return await knex('pet')
    .where({ 'pet.id': updatedPet[0].id })
    .select('pet.id', 'pet.name')
    .join('animal', { animalId: 'animal.id' })
    .select('animal.type');
};

const deleteById = async (petId: number) => {
  return await knex('pet').where({ id: petId }).del();
};

export const petRepository = {
  create,
  getAll,
  getByPage,
  getById,
  update,
  deleteById,
};
