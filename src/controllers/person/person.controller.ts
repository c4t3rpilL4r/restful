import { Request, Response } from 'express';
import { Person } from '@app/models';
import { personService } from '@app/services';

const create = async (req: Request, res: Response) => {
  try {
    const person: Person = { ...req.body };

    const newPerson = await personService.create(person);

    res.status(201).send(newPerson);
  } catch (err) {
    res
      .status(500)
      .send({ message: 'Error creating person data.', error: err });
  }
};

const get = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? +req.query.page : 0;
    const limit = req.query.limit ? +req.query.limit : 0;

    const persons = await personService.get(page, limit);

    res.status(200).send(persons);
  } catch (err) {
    res.status(500).send({ message: 'Error fetching data.', error: err });
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const personId = +req.params.personId;

    const person = await personService.getById(personId);

    res.status(200).send(person);
  } catch (err) {
    res
      .status(500)
      .send({ message: 'Error fetching person data.', error: err });
  }
};

// const get = async (personId?: number, page?: number, limit?: number) => {
//   if (personId) {
//     return personService.getById(personId);
//   } else {
//     if (page && limit) {
//       return personService.getByPage(page, limit);
//     } else {
//       return personService.get();
//     }
//   }
// };

const update = async (person: Person) => {
  return personService.update(person);
};

const deleteById = async (personId: number) => {
  return personService.deleteById(personId);

  // if (personId && petId) {
  //   return await knex('pet_owner').where({ ownerId: personId, petId }).del();
  // } else if (personId) {
  //   await knex('pet_owner').where({ ownerId: personId }).del();
  //   return await knex('person').where({ id: personId }).del();
  // } else if (petId) {
  //   await knex('pet_owner').where({ ownerId: personId }).del();
  //   return await knex('pet').where({ id: petId }).del();
  // }
};

// const getPetsByOwnerId = async (
//   ownerId: number,
//   petId?: string,
//   page?: number,
//   limit?: number,
// ) => {
//   if (petId && +petId > 0) {
//     return await knex('pet_owner')
//       .where({ ownerId, petId })
//       .join('pet', { petId: 'pet.id' })
//       .select('pet.name')
//       .join('animal', { animalId: 'animal.id' })
//       .select('animal.type');
//   } else {
//     if (page && limit) {
//       return await knex('pet_owner')
//         .where({ ownerId })
//         .join('pet', { petId: 'pet.id' })
//         .select('ownerId', 'petId', 'pet.name')
//         .join('animal', { animalId: 'animal.id' })
//         .select('animal.type')
//         .offset((page - 1) * limit)
//         .limit(limit);
//     } else {
//       return await knex('pet_owner')
//         .where({ ownerId })
//         .join('pet', { petId: 'pet.id' })
//         .select('petId', 'pet.name')
//         .join('animal', { animalId: 'animal.id' })
//         .select('animal.type');
//     }
//   }
// };

export const personController = {
  create,
  get,
  getById,
  update,
  deleteById,
};
