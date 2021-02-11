import { IPet } from '@app/interfaces';
import { Pet } from 'src/db_pg/models';
import knex from '../db_pg/knex-config';

const create = async (pet: IPet, ownerId: number) => {
  const [createdPet] = await knex<Pet>('pets').insert(pet).returning('*');
  await knex('persons_pets').insert({
    ownerId,
    petId: createdPet.id,
  });

  return createdPet;
};

const getPaginated = async (page: number, limit: number) => {
  const result = await knex<Pet>('pets')
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
