import { Animal } from '@app/models';
import { animalRepository } from '@app/repositories';

const create = async (animal: Animal) => {
  return await animalRepository.create(animal);
};

const getAll = async (page: number, limit: number) => {
  return await animalRepository.getAll(page, limit);
};

const getById = async (animalId: number) => {
  return await animalRepository.getById(animalId);
};

const getByType = async (animalType: string) => {
  return await animalRepository.getByType(animalType);
};

const update = async (animal: Animal) => {
  return await animalRepository.update(animal);
};

const deleteById = async (animalId: number) => {
  return await animalRepository.deleteById(animalId);
};

export const animalService = {
  create,
  getAll,
  getById,
  getByType,
  update,
  deleteById,
};
