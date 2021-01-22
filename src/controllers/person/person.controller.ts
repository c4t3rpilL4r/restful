import { RequestHandler } from 'express';
import { Person, Pagination } from '@app/models';
import { personService } from '@app/services';

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
    let persons: Person[];

    if (req.query.page && req.query.limit) {
      const pagination: Pagination = {
        page: +req.query.page,
        limit: +req.query.limit,
      };

      persons = await personService.getByPage(pagination);
    } else {
      persons = await personService.getAll();
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

    if (!person.length) {
      res.status(404).send({ message: 'Person not found.' });
      return;
    }

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
    const person = await personService.getById(personId);

    if (!person.length) {
      res.status(404).send({ message: 'Person not found.' });
      return;
    }

    const updatedPersonDetails: Person = {
      id: person[0].id,
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
    const person = await personService.getById(personId);

    if (!person.length) {
      res.status(404).send({ message: 'Person not found.' });
      return;
    }

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
  get: getAll,
  getById,
  update,
  deleteById,
};
