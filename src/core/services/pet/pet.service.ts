import { Pet, PetOwner } from '@app/models';
import { petRepository } from '@app/repositories';

const create = async (pet: Pet) => {
  return await petRepository.create(pet);
};

const getAll = async (page: number, limit: number) => {
  return await petRepository.getAll(page, limit);
};

const getById = async (petId: number) => {
  return await petRepository.getById(petId);
};

const update = async (pet: Pet) => {
  return petRepository.update(pet);
};

const deleteById = async (petId: number) => {
  return await petRepository.deleteById(petId);
};

export const petService = {
  create,
  getAll,
  getById,
  update,
  deleteById,
};
