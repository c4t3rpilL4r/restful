import { Person } from '@app/models';
import { personRepository } from '@app/repositories';

const create = async (person: Person) => {
  return await personRepository.create(person);
};

const getAll = async (page: number, limit: number) => {
  return await personRepository.getAll(page, limit);
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
  getById,
  create,
  update,
  deleteById,
};
