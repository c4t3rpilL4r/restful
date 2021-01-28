import { PetOwner } from '@app/models';
import knex from '../db_pg/knex-config';

const query = knex('pet_owner');

const filterQuery = (petOwner: PetOwner) => {
  if (petOwner.ownerId && petOwner.petId) {
    query.where({ ownerId: petOwner.ownerId, petId: petOwner.petId });
  } else if (petOwner.ownerId) {
    query.where({ ownerId: petOwner.ownerId });
  } else if (petOwner.petId) {
    query.where({ petId: petOwner.petId });
  }
};

const create = async (petOwner: PetOwner) => {
  const newPetOwner = await query.insert(petOwner).returning('*');

  return await query
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

const getAll = async (
  page: number,
  limit: number,
  petOwner: PetOwner,
  showOwnerId: boolean,
) => {
  if (page && limit) {
    query.offset((page - 1) * limit).limit(limit);
  }

  if (showOwnerId) {
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

const getPetAndOrOwner = async (petOwner: PetOwner) => {
  filterQuery(petOwner);

  return await query
    .join('pet', { petId: 'pet.id' })
    .select('pet.id', 'pet.name')
    .join('animal', { animalId: 'animal.id' })
    .select('animal.type');
};

const deletePetAndOrOwner = async (petOwner: PetOwner) => {
  filterQuery(petOwner);

  return query.del();
};

export const petOwnerRepository = {
  create,
  getAll,
  getPetAndOrOwner,
  deletePetAndOrOwner,
};
