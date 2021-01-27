import { Animal } from '@app/models';
import knex from '../db_pg/knex-config';

const create = async (animal: Animal) => {
  return await knex('animal').insert(animal).returning('*');
};

const get = async () => {
  return await knex('animal').select();
};

const getByPage = async (page: number, limit: number) => {
  return await knex('animal')
    .select()
    .offset((page - 1) * limit)
    .limit(limit);
};

const getById = async (animalId: number) => {
  return await knex('animal').where({ id: animalId });
};

const getByType = async (animalType: string) => {
  return await knex('animal').where({ type: animalType });
};

const update = async (animal: Animal) => {
  return await knex('animal')
    .where({ id: animal.id })
    .update(animal)
    .returning('*');
};

const deleteById = async (animalId: number) => {
  return await knex('animal').where({ id: animalId }).del();
};

export const animalRepository = {
  create,
  get,
  getByPage,
  getById,
  getByType,
  update,
  deleteById,
};
