import { RequestHandler } from 'express';
import { Animal, Pagination } from '@app/models';
import { animalService } from '@app/services';

const create: RequestHandler = async (req, res) => {
  try {
    const animalType = req.body.type;
    const animal = await animalService.getByType(animalType);

    if (animal.length) {
      res.status(409).send({ message: 'Animal registered already.' });
      return;
    }

    const newAnimalDetails: Animal = { ...req.body };
    const newAnimal = await animalService.create(newAnimalDetails);

    res.status(200).send(newAnimal);
  } catch (err) {
    res.status(500).send({
      message: 'Error creating animal data.',
      error: err,
    });
  }
};

const getAll: RequestHandler = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const pagination: Pagination = {
      page: +page,
      limit,
    };

    const animals = await animalService.getByPage(pagination);

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

    if (!animal.length) {
      res.status(400).send({ message: 'Animal not found' });
      return;
    }

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
    const animal = await animalService.getById(animalId);

    if (!animal.length) {
      res.status(404).send({ message: 'Animal not found.' });
      return;
    }

    const updatedAnimalDetails: Animal = {
      id: animalId,
      ...req.body,
    };

    const updatedAnimal = await animalService.update(updatedAnimalDetails);

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
    const animal = await animalService.getById(animalId);

    if (!animal.length) {
      res.status(404).send({ message: 'Animal not found.' });
      return;
    }

    await animalService.deleteById(animalId);

    res.status(200).send({ message: 'Animal deletion successful.' });
  } catch (err) {
    res.status(500).send({
      message: 'Error deleting animal data.',
      error: err,
    });
  }
};

export const animalController = {
  create,
  getAll,
  getById,
  update,
  deleteById,
};
