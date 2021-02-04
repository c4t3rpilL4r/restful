import { IAnimal } from '@app/interfaces';
import { Animal } from '@app/models';
import knex from '../db_pg/knex-config';

const create = async (animal: IAnimal) => {
  const [createdAnimal] = await knex<Animal>('animal')
    .insert(animal)
    .returning('*');

  return createdAnimal;
};

const getAll = async (page: number, limit: number) => {
  const query = knex<Animal>('animal');

  if (page && limit) {
    query.offset((page - 1) * limit).limit(limit);
  }

  return await query.select('*');
};

const getById = async (animalId: number) => {
  const animal = await knex<Animal>('animal')
    .where({ id: animalId })
    .first('*');

  return animal;
};

const getByType = async (animalType: string) => {
  const animal = await knex<Animal>('animal')
    .where({ type: animalType })
    .first('*');

  return animal;
};

const update = async (animal: Animal) => {
  const [updatedAnimal] = await knex<Animal>('animal')
    .where({ id: animal.id })
    .update(animal)
    .returning('*');

  return updatedAnimal;
};

const deleteById = async (animalId: number) => {
  const isDeleted = await knex<Animal>('animal').where({ id: animalId }).del();

  return !!isDeleted;
};

export const animalRepository = {
  create,
  getAll,
  getById,
  getByType,
  update,
  deleteById,
};
