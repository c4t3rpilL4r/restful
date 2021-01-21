import { Person } from '@app/models';
import { personRepository, petOwnerRepository } from '@app/repositories';

const create = async (person: Person) => {
  return await personRepository.create(person);
};

const get = async (page?: number, limit?: number) => {
  if (page && limit) {
    return await personRepository.getByPage(page, limit);
  } else {
    return await personRepository.get();
  }
};

const getById = async (personId: number) => {
  return await personRepository.getById(personId);
};

const update = async (person: Person) => {
  if (!person.id) {
    return;
  }

  const personExists = await personRepository.getById(person.id);

  if (!personExists.length) {
    return personExists;
  }

  return await personRepository.update(person);
};

const deleteById = async (personId: number) => {
  const personExists = await personRepository.getById(personId);

  if (!personExists.length) {
    return personExists;
  }

  await petOwnerRepository.deleteOwner(personId);
  return await personRepository.deleteById(personId);
};

export const personService = {
  get,
  getById,
  create,
  update,
  deleteById,
};
