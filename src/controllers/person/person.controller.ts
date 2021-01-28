import { RequestHandler } from 'express';
import { Person, PetOwner } from '@app/models';
import { personService, petOwnerService } from '@app/services';

const create: RequestHandler = async (req, res) => {
  try {
    const person: Person = { ...req.body };
    const newPerson = await personService.create(person);

    res.status(200).send(newPerson);
  } catch (err) {
    res.status(500).send({
      message: 'Error creating person data.',
      error: err,
    });
  }
};

const getAll: RequestHandler = async (req, res) => {
  try {
    const { page, limit } = req.query as any;
    const persons = await personService.getAll(page, limit);

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
    const updatedPersonDetails: Person = {
      id: personId,
      ...req.body,
    };

    const updatedPerson = await personService.update(updatedPersonDetails);

    res.status(200).send(updatedPerson);
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
    const petOwner: PetOwner = {
      ownerId: personId,
    };

    await petOwnerService.deletePetAndOrOwner(petOwner);
    await personService.deleteById(personId);

    res.status(200).send({ message: 'Person deletion successful.' });
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
