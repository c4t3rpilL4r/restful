import { Pet, PetOwner } from '@app/models';
import { petRepository, petOwnerRepository } from '@app/repositories';

const create = async (personId: number, pet: Pet) => {
  const newPet = await petRepository.create(pet);

  const petOwner: PetOwner = {
    ownerId: personId,
    petId: newPet[0].id,
  };

  return await petOwnerRepository.create(petOwner);
};

const getAll = async (ownerId?: number, page?: number, limit?: number) => {
  if (page && limit) {
    if (ownerId) {
      return await petOwnerRepository.getByOwnerIdWithLimit(
        ownerId,
        page,
        limit,
      );
    } else {
      return await petOwnerRepository.getByPage(page, limit);
    }
  } else if (ownerId) {
    return await petOwnerRepository.getByOwnerId(ownerId);
  } else {
    return await petOwnerRepository.getAll();
  }
};

const getById = async (petId: number) => {
  return await petOwnerRepository.getByPetId(petId);
};

const getByOwnerId = async (ownerId: number, page?: number, limit?: number) => {
  if (page && limit) {
    return await petOwnerRepository.getByOwnerIdWithLimit(ownerId, page, limit);
  } else {
    return await petOwnerRepository.getByOwnerId(ownerId);
  }
};

const update = async (pet: Pet) => {
  const updatedPet = await petRepository.update(pet);

  return await petOwnerRepository.getByPetId(updatedPet[0].id);
};

const deleteById = async (petId: number) => {
  await petOwnerRepository.deletePet(petId);
  return await petRepository.deleteById(petId);
};

export const petService = {
  create,
  getAll,
  getById,
  getByOwnerId,
  update,
  deleteById,
};
