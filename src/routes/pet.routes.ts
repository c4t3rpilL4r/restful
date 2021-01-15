import knex from '../db_pg/knex-config';
import express from 'express';
import { Animal, Pet, PetOwner } from '@app/models';
import { paginationService } from '../core/services/pagination/pagination.service';

const router = express.Router();

// CREATE
router.post('/', async (req, res) => {
  try {
    const person = await knex('person').where({ id: +req.body.personId });

    if (!person.length) {
      res.status(404);
      res.send({ message: 'Person not found.' });
      return;
    }

    let animal = await knex('animal').where({ type: req.body.animalType });

    if (!animal.length) {
      const newAnimal: Animal = {
        type: req.body.animalType,
      };

      animal = await knex('animal').insert(newAnimal).returning('*');
    }

    const pet: Pet = {
      name: req.body.name,
      animalId: animal[0].id,
    };

    const newPet = await knex('pet').insert(pet).returning('*');
    const petOwner: PetOwner = {
      ownerId: +req.body.personId,
      petId: +newPet[0].id,
    };

    const newPetOwner = await knex('pet_owner')
      .insert(petOwner)
      .join('pet', { petId: 'pet.id' })
      .select('ownerId', 'petId', 'pet.name')
      .join('animal', { animalId: 'animal.id' })
      .select('animal.type')
      .returning('*');

    res.status(200);
    res.send(newPetOwner);
  } catch (err) {
    res.status(500);
    res.send({ message: 'Error creating pet.', error: err });
  }
});

// READ
// all pets
router.get('/', async (req, res) => {
  try {
    const pets = await knex('pet_owner')
      .join('person', { ownerId: 'person.id' })
      .select('ownerId', 'person.firstName', 'person.lastName')
      .join('pet', { petId: 'pet.id' })
      .select('pet.id', 'pet.name')
      .join('animal', { animalId: 'animal.id' })
      .select('animal.type');
    const paginated = paginationService.paginate(req, pets);

    res.status(200);
    res.send(paginated);
  } catch (err) {
    res.status(404);
    res.send({ message: 'Error fetching data.', error: err });
  }
});

// individual pet
router.get('/:petId', async (req, res) => {
  try {
    const pet = await knex('pet').where({ id: +req.params.petId });

    res.status(200);
    res.send(pet);
  } catch (err) {
    res.status(404);
    res.send({ message: 'Pet not found.', error: err });
  }
});

// fetch owners of pet
router.get('/:petId/owner', async (req, res) => {
  try {
    const pet = await knex('pet_owner').where({ petId: +req.params.petId });

    if (!pet.length) {
      res.status(404);
      res.send({ message: 'Pet not found.' });
      return;
    }

    const owner = await knex('pet_owner')
      .where({ petId: +req.params.petId })
      .join('pet', { petId: 'pet.id' })
      .select('petId', 'pet.name')
      .join('animal', { animalId: 'animal.id' })
      .select('animal.type')
      .join('person', { ownerId: 'person.id' })
      .select('ownerId', 'person.firstName', 'person.lastName');

    res.status(200);
    res.send(owner);
  } catch (err) {
    res.status(500);
  }
});

// UPDATE
router.put('/:petId', async (req, res) => {
  const pet: Pet = { ...req.body };

  try {
    const updatedPet = await knex('pet')
      .where({ id: +req.params.petId })
      .update(pet)
      .returning('*');

    res.status(200);
    res.send(updatedPet);
  } catch (err) {
    res.status(500);
    res.send({ message: 'Error updating data.', error: err });
  }
});

// DELETE
router.delete('/:petId', async (req, res) => {
  try {
    await knex('pets')
      .where({ id: +req.params.petId })
      .del();

    res.status(200);
    res.send({ message: 'Deletion successful.' });
  } catch (err) {
    res.status(500);
    res.send({ message: 'Error deleting data.', error: err });
  }
});

export const petRouter = router;
