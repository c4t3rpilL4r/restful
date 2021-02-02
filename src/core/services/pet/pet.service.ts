import { Pet, PersonPet } from '@app/models';
import { petRepository } from '@app/repositories';

const create = async (pet: Pet) => {
  return await petRepository.create(pet);
};

const addOwnerToPet = async (petOwner: PersonPet) => {
  return await petRepository.addOwnerToPet(petOwner);
};

const getAll = async (page?: number, limit?: number) => {
  return await petRepository.getAll(page, limit);
};

const getAllIncludingOwnerId = async (page?: number, limit?: number) => {
  return await petRepository.getAllIncludingOwnerId(page, limit);
};

const getByOwnerId = async (ownerId: number, page?: number, limit?: number) => {
  return await petRepository.getByOwnerId(ownerId, page, limit);
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

const deleteOwnership = async (ownerId: number, petId?: number) => {
  return await petRepository.deleteOwnership(ownerId, petId);
};

export const petService = {
  create,
  addOwnerToPet,
  getAll,
  getAllIncludingOwnerId,
  getByOwnerId,
  getById,
  update,
  deleteById,
  deleteOwnership,
};
