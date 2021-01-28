import { Animal } from '@app/models';
import knex from '../db_pg/knex-config';

const query = knex('animal');

const create = async (animal: Animal) => {
  return await query.insert(animal).returning('*');
};

const getAll = async (page: number, limit: number) => {
  if (page && limit) {
    query.offset((page - 1) * limit).limit(limit);
  }

  return await query.select();
};

const getById = async (animalId: number) => {
  return await query.where({ id: animalId });
};

const getByType = async (animalType: string) => {
  return await query.where({ type: animalType });
};

const update = async (animal: Animal) => {
  return await query.where({ id: animal.id }).update(animal).returning('*');
};

const deleteById = async (animalId: number) => {
  return await query.where({ id: animalId }).del();
};

export const animalRepository = {
  create,
  getAll,
  getById,
  getByType,
  update,
  deleteById,
};
