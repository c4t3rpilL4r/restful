import { PetOwner } from '@app/models';
import { petOwnerRepository } from '@app/repositories';

const create = async (petOwner: PetOwner) => {
  return await petOwnerRepository.create(petOwner);
};

const getAll = async (
  page: number,
  limit: number,
  petOwner: PetOwner,
  showOwnerId: boolean,
) => {
  return await petOwnerRepository.getAll(page, limit, petOwner, showOwnerId);
};

const getPetAndOrOwner = async (petOwner: PetOwner) => {
  return await petOwnerRepository.getPetAndOrOwner(petOwner);
};

const deletePetAndOrOwner = async (petOwner: PetOwner) => {
  return await petOwnerRepository.deletePetAndOrOwner(petOwner);
};

export const petOwnerService = {
  create,
  getAll,
  getPetAndOrOwner,
  deletePetAndOrOwner,
};
