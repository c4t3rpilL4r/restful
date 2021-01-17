import knex from '../db_pg/knex-config';
import express from 'express';
import { Person } from '@app/models';
import { paginationService } from '../core/services/pagination/pagination.service';

const router = express.Router();

// CREATE
// create person
router.post('/', async (req, res) => {
  const person: Person = { ...req.body };

  try {
    const newPerson = await knex('person').insert(person).returning('*');

    res.status(201);
    res.send(newPerson);
  } catch (err) {
    res.status(500);
    res.send({ message: 'Error creating new data.', error: err });
  }
});

// READ
// all persons
router.get('/', async (req, res) => {
  try {
    const persons = await knex('person').select('*');
    const paginated = paginationService.paginate(req, persons);

    res.status(200);
    res.send(paginated);
  } catch (err) {
    res.status(500);
    res.send({ message: 'Error fetching persons data.', error: err });
  }
});

// individual person
router.get('/:personId', async (req, res) => {
  try {
    const person = await knex('person').where({ id: +req.params.personId });

    if (!person.length) {
      res.status(404);
      res.send({ message: 'Person not found.' });
      return;
    }

    res.status(200);
    res.send(person);
  } catch (err) {
    res.status(500);
    res.send({ message: 'Error fetching person data.', error: err });
  }
});

// fetch all pets from person
router.get('/:personId/pets', async (req, res) => {
  try {
    const person = await knex('person').where({ id: +req.params.personId });

    if (!person.length) {
      res.status(404);
      res.send({ message: 'Person not found.' });
      return;
    }

    const pets = await knex('pet_owner')
      .where({ ownerId: +req.params.personId })
      .join('person', { ownerId: 'person.id' })
      .select('ownerId', 'person.firstName', 'person.lastName')
      .join('pet', { petId: 'pet.id' })
      .select('petId', 'pet.name')
      .join('animal', { animalId: 'animal.id' })
      .select('animal.type');
    const paginated = paginationService.paginate(req, pets);

    res.status(200);
    res.send(paginated);
  } catch (err) {
    res.status(404);
    res.send({ message: 'Person does not own any pet.', error: err });
  }
});

// fetch a pet from person
router.get('/:personId/pets/:petId', async (req, res) => {
  try {
    const pet = await knex('pet_owner')
      .where({
        ownerId: +req.params.personId,
        petId: +req.params.petId,
      })
      .join('person', { ownerId: 'person.id' })
      .select('ownerId', 'person.firstName', 'person.lastName')
      .join('pet', { petId: 'pet.id' })
      .select('pet.id', 'pet.name')
      .join('animal', { animalId: 'animal.id' })
      .select('animal.type');

    if (!pet.length) {
      res.status(404);
      res.send({ message: 'No pet found for person.' });
      return;
    }

    res.status(200);
    res.send(pet);
  } catch (err) {
    res.status(404);
    res.send({ message: 'Error fetching pet data.', error: err });
  }
});

// UPDATE
router.put('/:personId', async (req, res) => {
  try {
    const person = await knex('person').where({ id: +req.params.personId });

    if (!person.length) {
      res.status(404);
      res.send({ message: 'Person not found.' });
      return;
    }

    const updatedPersonDetails: Person = { ...req.body };

    const updatedPerson = await knex('person')
      .where({ id: +req.params.personId })
      .update(updatedPersonDetails)
      .returning('*');

    res.status(200);
    res.send(updatedPerson);
  } catch (err) {
    res.status(500);
    res.send({ message: 'Error updating person data.', error: err });
  }
});

// DELETE
router.delete('/:personId', async (req, res) => {
  try {
    const person = await knex('person').where({ id: +req.params.personId });

    if (!person.length) {
      res.status(404);
      res.send({ message: 'Person not found.' });
      return;
    }

    await knex('person')
      .where({ id: +req.params.personId })
      .del();

    res.status(200);
    res.send({ message: 'Person data deletion successful.' });
  } catch (err) {
    res.status(500);
    res.send({ message: 'Error deleting person data.', error: err });
  }
});

export const personRouter = router;
