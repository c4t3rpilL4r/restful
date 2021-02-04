import { RequestHandler } from 'express';
import { Person } from '@app/models';
import { personService } from '@app/services';

const create: RequestHandler = async (req, res) => {
  try {
    const person: Person = { ...req.body };
    const createdPerson = await personService.create(person);

    res.status(200).send(createdPerson);
  } catch (err) {
    res.status(500).send({
      message: 'Error creating person data.',
      error: err,
    });
  }
};

const getAll: RequestHandler = async (req, res) => {
  try {
    const { page, limit, petOwnersOnly, petId } = req.query as any;
    let persons: Person[] = [];

    if (petId) {
      persons = await personService.getByPetId(petId);
    } else if (petOwnersOnly) {
      persons = await personService.getPetOwners(page, limit);
    } else {
      persons = await personService.getAll(page, limit);
    }

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
  getAll,
  getById,
  update,
  deleteById,
};
