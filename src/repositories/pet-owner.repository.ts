import knex from '../db_pg/knex-config';
import { PetOwner } from '@app/models';
import { query } from 'express';

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

// rename to getbypage
const getAll = async (
  page: number,
  limit: number,
  petOwner: PetOwner,
  includeOwnerId?: boolean,
) => {
  const query = knex('pet_owner');

  if (page && limit) {
    query.offset((page - 1) * limit).limit(limit);
  }

  if (includeOwnerId) {
    query.select('ownerId');
  }

  if (petOwner.ownerId) {
    query.where({ ownerId: petOwner.ownerId });
  }

  return await query
    .join('pet', { petId: 'pet.id' })
    .select('pet.id', 'pet.name')
    .join('animal', { animalId: 'animal.id' })
    .select('animal.type');
};

const getPet = async (petId: number) => {
  return await knex('pet_owner')
    .where({ petId })
    .join('animal', { animalId: 'animal.id' })
    .select('pet.id', 'pet.name', 'animal.type');
};

const getOwner = async (ownerId: number) => {
  return await knex('pet_owner')
    .where({ ownerId })
    .join('person', { ownerId: 'person.id' })
    .select('ownerId', 'person.firstName', 'person.lastName');
};

const getPetByPetOwner = async (petOwner: PetOwner) => {
  return await knex('pet_owner')
    .where({ ownerId: petOwner.ownerId, petId: petOwner.petId })
    .join('pet', { petId: 'pet.id' })
    .select('pet.name')
    .join('animal', { animalId: 'animal.id' })
    .select('animal.type');
};

// rename to findOne
// findAll
const getPetAndOrOwner = async (petOwner: PetOwner) => {
  const query = knex('pet_owner');

  if (petOwner.ownerId && petOwner.petId) {
    if (petOwner.ownerId > 0) {
      query
        .where({
          ownerId: petOwner.ownerId,
          petId: petOwner.petId,
        })
        .join('pet', { petId: 'pet.id' })
        .select('pet.name')
        .join('animal', { animalId: 'animal.id' })
        .select('animal.type');
    } else {
      query
        .where({ petId: petOwner.petId })
        .join('person', { ownerId: 'person.id' })
        .select('person.id', 'person.firstName', 'person.lastName');
    }
  } else if (petOwner.ownerId) {
    query
      .where({ ownerId: petOwner.ownerId })
      .join('pet', { petId: 'pet.id' })
      .select('pet.id', 'pet.name')
      .join('animal', { animalId: 'animal.id' })
      .select('animal.type');
  } else if (petOwner.petId) {
    query.where({ petId: petOwner.petId });
  }

  return await query;
};

// deleteOne
// deleteAll
const deletePetAndOrOwner = async (petOwner: PetOwner) => {
  const query = knex('pet_owner');

  if (petOwner.ownerId && petOwner.petId) {
    query.where({ ownerId: petOwner.ownerId, petId: petOwner.petId });
  } else if (petOwner.ownerId) {
    query.where({ ownerId: petOwner.ownerId });
  } else if (petOwner.petId) {
    query.where({ petId: petOwner.petId });
  }

  return query.del();
};

export const petOwnerRepository = {
  create,
  getAll,
  getPetAndOrOwner,
  deletePetAndOrOwner,
};
