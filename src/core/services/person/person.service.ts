import { Person } from '@app/models';
import { personRepository } from '@app/repositories';

const create = async (person: Person) => {
  return await personRepository.create(person);
};

const get = async (page?: number, limit?: number) => {
  if (page && limit) {
    return personRepository.getByPage(page, limit);
  } else {
    return personRepository.get();
  }
};

const getById = async (personId: number) => {
  return personRepository.getById(personId);
};

const update = async (person: Person) => {
  return await personRepository.update(person);
};

const deleteById = async (personId: number) => {
  return await personRepository.deleteById(personId);
};

export const personService = {
  get,
  getById,
  create,
  update,
  deleteById,
};
