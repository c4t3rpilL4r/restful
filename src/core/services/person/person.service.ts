import { personRepository } from '@app/repositories';
import { IPerson, IPetOwnership } from '@app/interfaces';
import { Person } from '@app/models';

const create = async (person: IPerson) => {
  return await personRepository.create(person);
};

const doPetOwnership = async (personPet: IPetOwnership) => {
  return await personRepository.doPetOwnership(personPet);
};

const getPaginated = async (page: number, limit: number) => {
  return await personRepository.getPaginated(page, limit);
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
  create,
  doPetOwnership,
  getPaginated,
  getById,
  update,
  deleteById,
};
