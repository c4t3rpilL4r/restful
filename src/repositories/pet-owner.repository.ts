import { Pagination, PetOwner } from '@app/models';
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

const getByPage = async (pagination: Pagination) => {
  return await knex('pet_owner')
    .select('ownerId')
    .join('pet', { petId: 'pet.id' })
    .select('pet.id', 'pet.name')
    .join('animal', { animalId: 'animal.id' })
    .select('animal.type')
    .offset((pagination.page - 1) * pagination.limit)
    .limit(pagination.limit);
};

const getByOwnerId = async (ownerId: number) => {
  return await knex('pet_owner')
    .where({ ownerId })
    .join('pet', { petId: 'pet.id' })
    .select('pet.id', 'pet.name')
    .join('animal', { animalId: 'animal.id' })
    .select('animal.type');
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

const getPetAndOwner = async (petOwner: PetOwner) => {
  return await knex('pet_owner')
    .where({
      ownerId: petOwner.ownerId,
      petId: petOwner.petId,
    })
    .join('pet', { petId: 'pet.id' })
    .select('pet.name')
    .join('animal', { animalId: 'animal.id' })
    .select('animal.type');
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

const deleteOwner = async (ownerId: number) => {
  return await knex('pet_owner').where({ ownerId }).del();
};

const deletePet = async (petId: number) => {
  return await knex('pet_owner').where({ petId }).del();
};

const deletePetAndOwner = async (petOwner: PetOwner) => {
  return await knex('pet_owner')
    .where({
      ownerId: petOwner.ownerId,
      petId: petOwner.petId,
    })
    .del();
};

export const petOwnerRepository = {
  create,
  getAll,
  getByPage,
  getByOwnerId,
  getByPetId,
  getPetAndOwner,
  update,
  deleteOwner,
  deletePet,
  deletePetAndOwner,
};
