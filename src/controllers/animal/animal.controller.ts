import { Request, Response } from 'express';
import { Animal } from '@app/models';
import { animalService } from '@app/services';

const create = async (req: Request, res: Response) => {
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

const get = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? +req.query.page : 0;
    const limit = req.query.limit ? +req.query.limit : 0;
    const animals = await animalService.get(page, limit);

    res.status(200).send(animals);
  } catch (err) {
    res.status(500).send({
      message: 'Error fetching all animal data.',
      error: err,
    });
  }
};

const getById = async (req: Request, res: Response) => {
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

const update = async (req: Request, res: Response) => {
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

const deleteById = async (req: Request, res: Response) => {
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
  get,
  getById,
  update,
};
