import { RequestHandler } from 'express';
import { Person } from '@app/models';
import { personService } from '@app/services';
import { IPersonPet } from '@app/interfaces';

const create: RequestHandler = async (req, res) => {
  try {
    const person: Person = { ...req.body };
    const createdPerson = await personService.create(person);

    res.status(201).send(createdPerson);
  } catch (err) {
    res.status(500).send({
      message: 'Error creating person data.',
      error: err,
    });
  }
};

const setPersonPet: RequestHandler = async (req, res) => {
  try {
    const { ownerId, petId } = req.params;

    const personPetDetails: IPersonPet = {
      ownerId: +ownerId,
      petId: +petId,
    };
    await personService.setPersonPet(personPetDetails);

    res.status(201).send({ message: 'Pet ownership successful.' });
  } catch (err) {
    res
      .status(500)
      .send({ message: 'Error adding pet ownership.', error: err });
  }
};

const getPaginated: RequestHandler = async (req, res) => {
  try {
    const { page, limit } = req.query as any;
    const persons = await personService.getPaginated(page, limit);

    res.status(200).send(persons);
  } catch (err) {
    res.status(500).send({
      message: 'Error fetching all person data.',
      error: err,
    });
  }
};

const getById: RequestHandler = async (req, res) => {
  try {
    const personId = +req.params.personId;
    const person = await personService.getById(personId);

    res.status(200).send(person);
  } catch (err) {
    res.status(500).send({
      message: 'Error fetching person data.',
      error: err,
    });
  }
};

const update: RequestHandler = async (req, res) => {
  try {
    const personId = +req.params.personId;
    const personNewDetails: Person = {
      id: personId,
      ...req.body,
    };
    const updatedPersonDetails = await personService.update(personNewDetails);

    res.status(200).send(updatedPersonDetails);
  } catch (err) {
    res.status(500).send({
      message: 'Error updating person data.',
      error: err,
    });
  }
};

const deleteById: RequestHandler = async (req, res) => {
  try {
    const personId = +req.params.personId;
    const isDeleted = await personService.deleteById(personId);

    const message = isDeleted
      ? 'Person deletion successful.'
      : 'Person deletion failed.';

    res.status(200).send({ message });
  } catch (err) {
    res.status(500).send({
      message: 'Error deleting person data.',
      error: err,
    });
  }
};

export const personController = {
  create,
  setPersonPet,
  getPaginated,
  getById,
  update,
  deleteById,
};
