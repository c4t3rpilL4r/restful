import { PetOwner } from '@app/models';
import knex from '../db_pg/knex-config';

const create = async (petOwner: PetOwner) => {
  const newPetOwner = await knex('pet_owner').insert(petOwner).returning('*');

  return await knex('pet_owner')
    .where({
      ownerId: newPetOwner[0].ownerId,
      petId: newPetOwner[0].petId,
    })
    .select('ownerId')
    .join('pet', { petId: 'pet.id' })
    .select('pet.id', 'pet.name')
    .join('animal', { animalId: 'animal.id' })
    .select('animal.type');
};

const getAll = async () => {
  return await knex('pet_owner')
    .select('ownerId')
    .join('pet', { petId: 'pet.id' })
    .select('pet.id', 'pet.name')
    .join('animal', { animalId: 'animal.id' })
    .select('animal.type');
};

const getByPage = async (page: number, limit: number) => {
  return await knex('pet_owner')
    .select('ownerId')
    .join('pet', { petId: 'pet.id' })
    .select('pet.id', 'pet.name')
    .join('animal', { animalId: 'animal.id' })
    .select('animal.type');
};

const getByOwnerId = async (ownerId: number) => {
  return await knex('pet_owner')
    .where({ ownerId })
    .join('pet', { petId: 'pet.id' })
    .select('pet.id', 'pet.name')
    .join('animal', { animalId: 'animal.id' })
    .select('animal.type');
};

const getByOwnerIdWithLimit = async (
  ownerId: number,
  page: number,
  limit: number,
) => {
  return await knex('pet_owner')
    .where({ ownerId })
    .join('animal', { animalId: 'animal.id' })
    .select('pet.id', 'pet.name', 'animal.type')
    .offset((page - 1) * limit)
    .limit(limit);
};

const getByPetId = async (petId: number) => {
  return await knex('pet_owner')
    .where({ petId })
    .select('ownerId')
    .join('pet', { petId: 'pet.id' })
    .select('pet.id', 'pet.name')
    .join('animal', { animalId: 'animal.id' })
    .select('animal.type');
};

const getByOwnerIdAndPetId = async (petOwner: PetOwner) => {
  return await knex('pet_owner').where({
    ownerId: petOwner.ownerId,
    petId: petOwner.petId,
  });
};

const update = async (petOwner: PetOwner) => {
  return await knex('pet_owner')
    .where({
      ownerId: petOwner.ownerId,
      petId: petOwner.petId,
    })
    .update(petOwner)
    .returning('*');
};

const updateByOwnerId = async (
  oldPetOwner: PetOwner,
  newPetOwner: PetOwner,
) => {
  return await knex('pet_owner')
    .where({ ownerId: oldPetOwner.ownerId, petId: oldPetOwner.petId })
    .update(newPetOwner)
    .returning('*');
};

const deleteOwner = async (ownerId: number) => {
  return await knex('pet_owner').where({ ownerId }).del();
};

const deletePet = async (petId: number) => {
  return await knex('pet_owner').where({ petId }).del();
};

const deleteByOwnerIdAndPetId = async (ownerId: number, petId: number) => {
  return await knex('pet_owner').where({ ownerId, petId }).del();
};

export const petOwnerRepository = {
  create,
  getAll,
  getByPage,
  getByOwnerId,
  getByOwnerIdWithLimit,
  getByPetId,
  getByOwnerIdAndPetId,
  update,
  updateByOwnerId,
  deleteOwner,
  deletePet,
  deleteByOwnerIdAndPetId,
};
