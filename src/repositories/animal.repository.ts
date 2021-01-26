import { Animal, Pagination } from '@app/models';
import knex from '../db_pg/knex-config';

const create = async (animal: Animal) => {
  return await knex('animal').insert(animal).returning('*');
};

const get = async () => {
  return await knex('animal').select();
};

const getByPage = async (pagination: Pagination) => {
  return await knex('animal')
    .select()
    .offset((pagination.page - 1) * pagination.limit)
    .limit(pagination.limit);
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
