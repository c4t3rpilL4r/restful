import knex from '../../db_pg/knex-config';
import express from 'express';
import { Animal } from '@app/models';

const router = express.Router();

// CREATE
router.post('/animals', async (req, res) => {
  try {
    const animal = await knex('animal').where({ type: req.body.type });

    if (animal.length) {
      res.status(409).send({ message: 'Animal type already registered.' });
      return;
    }

    const newAnimalDetails: Animal = {
      type: req.body.type,
    };

    const newAnimal = await knex('animal')
      .insert(newAnimalDetails)
      .returning('*');

    res.status(201).send(newAnimal);
  } catch (err) {
    res.status(500).send({ message: 'Error creating new data.', error: err });
  }
});

// READ
// all animals
router.get('/animals', async (req, res) => {
  try {
    const animals = await knex('animal').select();

    res.status(200).send(animals);
  } catch (err) {
    res.status(404).send({ message: 'Error fetching data.', error: err });
  }
});

// individual animal
router.get('/animals/:animalId', async (req, res) => {
  try {
    const animal = await knex('animal').where({ id: +req.params.animalId });

    res.status(201).send(animal);
  } catch (err) {
    res.status(404).send({ message: 'Animal not found.', error: err });
  }
});

// UPDATE
router.put('/animals/:animalId', async (req, res) => {
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

    res.status(200).send(updatedAnimal);
  } catch (err) {
    res
      .status(500)
      .send({ message: 'Error updating animal data.', error: err });
  }
});

// DELETE
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

    res.status(200).send({ message: 'Animal data deletion successful.' });
  } catch (err) {
    res
      .status(500)
      .send({ message: 'Error deleting animal data.', error: err });
  }
});

export const animalRouter = router;
