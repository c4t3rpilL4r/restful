import { Pagination, PetOwner } from '@app/models';
import { petOwnerRepository } from '@app/repositories';

const create = async (petOwner: PetOwner) => {
  return await petOwnerRepository.create(petOwner);
};

const getAll = async () => {
  return await petOwnerRepository.getAll();
};

const getByPage = async (pagination: Pagination) => {
  return await petOwnerRepository.getByPage(pagination);
};

const getByOwnerId = async (ownerId: number) => {
  return await petOwnerRepository.getByOwnerId(ownerId);
};

const getByPetId = async (petId: number) => {
  return await petOwnerRepository.getByPetId(petId);
};

const getPetAndOwner = async (petOwner: PetOwner) => {
  return await petOwnerRepository.getPetAndOwner(petOwner);
};

const deleteByOwnerId = async (ownerId: number) => {
  return await petOwnerRepository.deleteByOwnerId(ownerId);
};

const deleteByPetId = async (petId: number) => {
  return await petOwnerRepository.deleteByPetId(petId);
};

const deletePetAndOwner = async (petOwner: PetOwner) => {
  return await petOwnerRepository.deletePetAndOwner(petOwner);
};

export const petOwnerService = {
  create,
  getAll,
  getByPage,
  getByOwnerId,
  getByPetId,
  getPetAndOwner,
  deleteByOwnerId,
  deleteByPetId,
  deletePetAndOwner,
};
