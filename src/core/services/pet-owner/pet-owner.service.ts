import { PetOwner } from '@app/models';
import { petOwnerRepository } from '@app/repositories';

const create = async (petOwner: PetOwner) => {
  return await petOwnerRepository.create(petOwner);
};

const deleteByOwnerIdAndPetId = async (ownerId: number, petId: number) => {
  return await petOwnerRepository.deleteByOwnerIdAndPetId(ownerId, petId);
};

export const petOwnerService = {
  create,
  deleteByOwnerIdAndPetId,
};
