import { Animal } from 'src/db_pg/models';
import { animalRepository } from '@app/repositories';
import { IAnimal } from '@app/interfaces';

const create = async (animal: IAnimal) => {
  return await animalRepository.create(animal);
};

const getPaginated = async (page: number, limit: number) => {
  return await animalRepository.getPaginated(page, limit);
};

const getById = async (animalId: number) => {
  return await animalRepository.getById(animalId);
};

const update = async (animal: Animal) => {
  return await animalRepository.update(animal);
};

const deleteById = async (animalId: number) => {
  return await animalRepository.deleteById(animalId);
};

export const animalService = {
  create,
  getPaginated,
  getById,
  update,
  deleteById,
};
