import { Pet, PetOwner } from '@app/models';
import {
  animalRepository,
  petRepository,
  petOwnerRepository,
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
  return await petRepository.update(pet);
};

const deleteById = async (petId: number) => {
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
