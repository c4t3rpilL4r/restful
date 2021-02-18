import { RequestHandler, Request } from 'express';
import { Animal } from 'src/db_pg/models';
import { animalService } from '@app/services';

const create: RequestHandler = async (req, res) => {
  try {
    const newAnimalDetails: Animal = { ...req.body };
    const createdAnimal = await animalService.create(newAnimalDetails);

    res.status(201).send(createdAnimal);
  } catch (err) {
    res.status(500).send({
      message: 'Error creating animal data.',
      error: err,
    });
  }
};

const getPaginated: RequestHandler = async (req: Request, res) => {
  try {
    const { page, limit } = req.query as any;
    const animals = await animalService.getPaginated(+page, +limit);

    res.status(200).send(animals);
  } catch (err) {
    res.status(500).send({
      message: 'Error fetching all animal data.',
      error: err,
    });
  }
};

const getById: RequestHandler = async (req, res) => {
  try {
    const animalId = +req.params.animalId;
    const animal = await animalService.getById(animalId);

    res.status(200).send(animal);
  } catch (err) {
    res.status(500).send({
      message: 'Error fetching animal data.',
      error: err,
    });
  }
};

const update: RequestHandler = async (req, res) => {
  try {
    const animalId = +req.params.animalId;
    const animalNewDetails: Animal = {
      id: animalId,
      ...req.body,
    };
    const updatedAnimal = await animalService.update(animalNewDetails);

    res.status(200).send(updatedAnimal);
  } catch (err) {
    res.status(500).send({
      message: 'Error updating animal data.',
      error: err,
    });
  }
};

const deleteById: RequestHandler = async (req, res) => {
  try {
    const animalId = +req.params.animalId;
    const isDeleted = await animalService.deleteById(animalId);

    const message = isDeleted
      ? 'Animal deletion successful.'
      : 'Animal deletion failed.';

    res.status(200).send({ message });
  } catch (err) {
    res.status(500).send({
      message: 'Error deleting animal data.',
      error: err,
    });
  }
};

export const animalController = {
  create,
  getPaginated,
  getById,
  update,
  deleteById,
};
