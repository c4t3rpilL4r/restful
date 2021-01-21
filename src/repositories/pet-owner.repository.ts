import { PetOwner } from '@app/models';
import knex from '../db_pg/knex-config';

const create = async (petOwner: PetOwner) => {
  return await knex('pet_owner').insert(petOwner).returning('*');
};

const getByOwnerId = async (ownerId: number) => {
  return await knex('pet_owner').where({ ownerId });
};

const getByPetId = async (petId: number) => {
  return await knex('pet_owner').where({ petId });
};

const updateOwnerId = async (oldOwnerId: number, petOwner: PetOwner) => {
  return await knex('pet_owner')
    .where({ ownerId: oldOwnerId })
    .update(petOwner)
    .returning('*');
};

const deleteOwner = async (ownerId: number) => {
  return await knex('pet_owner').where({ ownerId }).del();
};

const deletePet = async (petId: number) => {
  return await knex('pet_owner').where({ petId }).del();
};

export const petOwnerRepository = {
  create,
  getByOwnerId,
  getByPetId,
  updateOwnerId,
  deleteOwner,
  deletePet,
};
