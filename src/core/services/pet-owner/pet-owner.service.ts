import { PetOwner } from '@app/models';
import { petOwnerRepository } from '@app/repositories';

const create = async (petOwner: PetOwner) => {
  return await petOwnerRepository.create(petOwner);
};

const get = async () => {
  return await petOwnerRepository.get();
};

const getByOwnerId = async (ownerId: number) => {
  return await petOwnerRepository.getByOwnerId(ownerId);
};

const getByOwnerIdWithLimit = async (
  ownerId: number,
  page: number,
  limit: number,
) => {
  return await petOwnerRepository.getByOwnerIdWithLimit(ownerId, page, limit);
};

const getByPetId = async (petId: number) => {
  return await petOwnerRepository.getByPetId(petId);
};

const getByOwnerIdAndPetId = async (petOwner: PetOwner) => {
  return await petOwnerRepository.getByOwnerIdAndPetId(petOwner);
};

const update = async (petOwner: PetOwner) => {
  return await petOwnerRepository.update(petOwner);
};

const updateByOwnerId = async (
  oldPetOwner: PetOwner,
  newPetOwner: PetOwner,
) => {
  return await petOwnerRepository.updateByOwnerId(oldPetOwner, newPetOwner);
};

const deleteByOwnerIdAndPetId = async (ownerId: number, petId: number) => {
  return await petOwnerRepository.deleteByOwnerIdAndPetId(ownerId, petId);
};

export const petOwnerService = {
  create,
  get,
  getByOwnerId,
  getByOwnerIdWithLimit,
  getByPetId,
  getByOwnerIdAndPetId,
  update,
  updateByOwnerId,
  deleteByOwnerIdAndPetId,
};
