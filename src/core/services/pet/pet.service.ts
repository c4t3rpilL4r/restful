import { Pet } from 'src/db_pg/models';
import { petRepository } from '@app/repositories';
import { IPet } from '@app/interfaces';

const create = async (pet: IPet, ownerId: number) => {
  return await petRepository.create(pet, ownerId);
};

const getPaginated = async (page: number, limit: number) => {
  return await petRepository.getPaginated(page, limit);
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
  getPaginated,
  getById,
  update,
  deleteById,
};
