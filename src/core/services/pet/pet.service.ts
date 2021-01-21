import { Pet, PetOwner } from '@app/models';
import {
  petOwnerRepository,
  petRepository,
  personRepository,
} from '@app/repositories';

const create = async (personId: number, pet: Pet) => {
  const newPet = await petRepository.create(pet);

  const petOwner: PetOwner = {
    ownerId: personId,
    petId: newPet[0].id,
  };

  await petOwnerRepository.create(petOwner);

  return newPet;
};

const get = async (page?: number, limit?: number) => {
  if (page && limit) {
    return await petRepository.getByPage(page, limit);
  } else {
    return await petRepository.get();
  }
};

const getById = async (petId: number) => {
  return await petRepository.getById(petId);
};

const update = async (pet: Pet) => {
  if (!pet.id) {
    return;
  }

  const petExists = await petRepository.getById(pet.id);

  if (!petExists.length) {
    return petExists;
  }

  return await petRepository.update(pet);
};

const updateOwner = async (oldOwnerId: number, newPetOwner: PetOwner) => {
  const oldOwnerExists = await personRepository.getById(oldOwnerId);

  if (!oldOwnerExists.length) {
    return oldOwnerExists;
  }

  const newOwnerExists = await personRepository.getById(newPetOwner.ownerId);

  if (!newOwnerExists.length) {
    return newOwnerExists;
  }
};

const deleteById = async (petId: number) => {
  const petExists = await petRepository.getById(petId);

  if (!petExists.length) {
    return petExists;
  }

  await petOwnerRepository.deletePet(petId);
  return await petRepository.deleteById(petId);
};

export const petService = {
  create,
  get,
  getById,
  update,
  deleteById,
};
