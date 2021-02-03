import { IAnimal } from '@app/interfaces';
import { Animal } from '@app/models';
import knex from '../db_pg/knex-config';

const create = async (animal: IAnimal) => {
  const newAnimalId = await knex<Animal>('animal')
    .insert(animal)
    .returning('id');

  return await knex<Animal>('animal').where({ id: newAnimalId[0] }).first('*');
};

const getAll = async (page: number, limit: number) => {
  const query = knex<Animal>('animal');

  if (page && limit) {
    query.offset((page - 1) * limit).limit(limit);
  }

  return await query.select();
};

const getById = async (animalId: number) => {
  return await knex<Animal>('animal').where({ id: animalId }).first('*');
};

const getByType = async (animalType: string) => {
  return await knex<Animal>('animal').where({ type: animalType }).first('*');
};

const update = async (animal: Animal) => {
  return await knex<Animal>('animal')
    .where({ id: animal.id })
    .update(animal)
    .returning('*');
};

const deleteById = async (animalId: number) => {
  return await knex('animal').where({ id: animalId }).del();
};

export const animalRepository = {
  create,
  getAll,
  getById,
  getByType,
  update,
  deleteById,
};
