import { Pagination, Pet, PetOwner } from '@app/models';
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

const getByPage = async (pagination: Pagination) => {
  return await petRepository.getByPage(pagination);
};

const getById = async (petId: number) => {
  return await petOwnerRepository.getByPetId(petId);
};

const getByOwnerId = async (ownerId: number) => {
  return await petOwnerRepository.getByOwnerId(ownerId);
};

const update = async (pet: Pet) => {
  return petRepository.update(pet);
};

const deleteById = async (petId: number) => {
  await petOwnerRepository.deletePet(petId);
  return await petRepository.deleteById(petId);
};

const deleteOwner = async (ownerId: number) => {
  return await petOwnerRepository.deleteOwner(ownerId);
};

export const petService = {
  create,
  getAll,
  getByPage,
  getById,
  getByOwnerId,
  update,
  deleteById,
  deleteOwner,
};
