import { Request, Response } from 'express';
import { Person } from '@app/models';
import { personService } from '@app/services';

const create = async (req: Request, res: Response) => {
  try {
    const person: Person = { ...req.body };

    const newPerson = await personService.create(person);

    res.status(200).send(newPerson);
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
    res
      .status(500)
      .send({ message: 'Error fetching person data.', error: err });
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

const update = async (req: Request, res: Response) => {
  try {
    const updatedPersonDetails: Person = {
      id: +req.params.personId,
      ...req.body,
    };

    const updatedPerson = await personService.update(updatedPersonDetails);

    res.status(200).send(updatedPerson);
  } catch (err) {
    res
      .status(500)
      .send({ message: 'Error updating person data.', error: err });
  }
};

const deleteById = async (req: Request, res: Response) => {
  try {
    const personId = +req.params.personId;
    const data = await personService.deleteById(personId);

    res
      .status(200)
      .send(data === 1 ? { message: 'Person deletion successful.' } : data);
  } catch (err) {
    res
      .status(500)
      .send({ message: 'Error deleting person data.', error: err });
  }
};

export const personController = {
  create,
  get,
  getById,
  update,
  deleteById,
};
