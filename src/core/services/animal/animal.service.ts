import { Animal } from '@app/models';
import { animalRepository } from '@app/repositories';

const create = async (animal: Animal) => {
  return await animalRepository.create(animal);
};

const get = async (page?: number, limit?: number) => {
  if (page && limit) {
    return await animalRepository.getByPage(page, limit);
  } else {
    return await animalRepository.get();
  }
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
  get,
  getById,
  getByType,
  update,
  deleteById,
};
