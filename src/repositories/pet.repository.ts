import { IPet, IPetFilters } from '@app/interfaces';
import { Pet } from 'src/db_pg/models';
import knex from '../db_pg/knex-config';

const create = async (pet: IPet, ownerId: number) => {
  const [createdPet] = await knex<Pet>('pets').insert(pet).returning('*');

  return createdPet;
};

const getPaginated = async (
  page: number,
  limit: number,
  filters?: IPetFilters,
) => {
  const query = knex('pets');

  if (filters?.ownerId) {
    query
      .join('persons_pets', { id: 'persons_pets.petId' })
      .where({ ownerId: filters.ownerId });
  }

  const result = await query
    .select('*')
    .offset((page - 1) * limit)
    .limit(limit);

  return result;
};

const getById = async (petId: number) => {
  const pet = await knex<Pet>('pets').where({ id: petId }).first('*');

  return pet;
};

const update = async (pet: Pet) => {
  const [updatedPet] = await knex<Pet>('pets')
    .where({ id: pet.id })
    .update(pet)
    .returning('*');

  return updatedPet;
};

const deleteById = async (petId: number) => {
  const deletedPet = await knex<Pet>('pets').where({ id: petId }).del();

  return !!deletedPet;
};

export const petRepository = {
  create,
  getPaginated,
  getById,
  update,
  deleteById,
};
