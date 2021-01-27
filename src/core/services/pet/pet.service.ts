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

const getAll = async () => {
  return await petOwnerRepository.getAll();
};

const getByPage = async (page: number, limit: number) => {
  return await petRepository.getByPage(page, limit);
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
  getByPage,
  getById,
  update,
  deleteById,
};
