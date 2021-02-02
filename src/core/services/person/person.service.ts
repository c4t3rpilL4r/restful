import { Person } from 'src/db_pg/models';
import { personRepository } from '@app/repositories';

const create = async (person: Person) => {
  return await personRepository.create(person);
};

const getAll = async (page?: number, limit?: number) => {
  return await personRepository.getAll(page, limit);
};

const getPetOwners = async (page?: number, limit?: number) => {
  return await personRepository.getPetOwners(page, limit);
};

const getByPetId = async (petId: number) => {
  return await personRepository.getByPetId(petId);
};

const getById = async (personId: number) => {
  return await personRepository.getById(personId);
};

const update = async (person: Person) => {
  return await personRepository.update(person);
};

const deleteById = async (personId: number) => {
  return await personRepository.deleteById(personId);
};

export const personService = {
  getAll,
  getPetOwners,
  getByPetId,
  getById,
  create,
  update,
  deleteById,
};
