import knex from '../db_pg/knex-config';
import express from 'express';
import { Animal } from '@app/models';

const router = express.Router();

// create
router.post('/', async (req, res) => {
  const animal: Animal = {
    type: req.body.type,
  };

  try {
    const newAnimal = await knex('animal').insert(animal).returning('*');

    res.status(201);
    res.send(newAnimal);
  } catch (err) {
    res.status(500);
    res.send({ message: 'Error creating new data.', error: err });
  }
});

// read
// all animals
router.get('/', async (req, res) => {
  try {
    const animals = await knex('animal').select();

    res.status(200);
    res.send(animals);
  } catch (err) {
    res.status(404);
    res.send({ message: 'Error fetching data.', error: err });
  }
});

// read
// individual animal
router.get('/:animalId', async (req, res) => {
  try {
    const animal = await knex('animal').where({ id: +req.params.animalId });

    res.status(201);
    res.send(animal);
  } catch (err) {
    res.status(404);
    res.send({ message: 'Animal not found.', error: err });
  }
});

// update
router.put('/:animalId', async (req, res) => {
  try {
    const animal = await knex('animal').where({ id: +req.params.animalId });

    if (!animal.length) {
      res.status(404);
      res.send({ message: 'Animal not found.' });
      return;
    }

    const updatedAnimalDetails: Animal = { ...req.body };

    const updatedAnimal = await knex('animal')
      .where({ id: +req.params.id })
      .update(updatedAnimalDetails)
      .returning('*');

    res.status(200);
    res.send(updatedAnimal);
  } catch (err) {
    res.status(500);
    res.send({ message: 'Error updating animal data.', error: err });
  }
});

// delete
router.delete('/:animalId', async (req, res) => {
  try {
    const animal = await knex('animal').where({ id: +req.params.animalId });

    if (!animal.length) {
      res.status(404);
      res.send({ message: 'Animal not found.' });
      return;
    }

    await knex('animal')
      .where({ id: +req.params.animalId })
      .del();

    res.status(200);
    res.send({ message: 'Animal data deletion successful.' });
  } catch (err) {
    res.status(500);
    res.send({ message: 'Error deleting animal data.', error: err });
  }
});

export const animalRouter = router;
