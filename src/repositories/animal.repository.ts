import { IAnimal } from '@app/interfaces';
import { Animal } from '@app/models';
import knex from '../db_pg/knex-config';

const create = async (animal: IAnimal) => {
  const [createdAnimal] = await knex<Animal>('animals')
    .insert(animal)
    .returning('*');

  return createdAnimal;
};

const getPaginated = async (page: number, limit: number) => {
  const result = await knex<Animal>('animals')
    .select('*')
    .offset((page - 1) * limit)
    .limit(limit);

  return result;
};

const getById = async (animalId: number) => {
  const animal = await knex<Animal>('animals')
    .where({ id: animalId })
    .first('*');

  return animal;
};

const update = async (animal: Animal) => {
  const [updatedAnimal] = await knex<Animal>('animals')
    .where({ id: animal.id })
    .update(animal)
    .returning('*');

  return updatedAnimal;
};

const deleteById = async (animalId: number) => {
  await knex<Animal>('animals').where({ id: animalId }).del();
};

export const animalRepository = {
  create,
  getPaginated,
  getById,
  update,
  deleteById,
};
