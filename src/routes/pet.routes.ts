import knex from '../db_pg/knex-config';
import express from 'express';
import { Animal, Pet, PetOwner } from '@app/models';

const router = express.Router();

// CREATE
router.post('/', async (req, res) => {
  const ownerId = +req.body.personId;

  try {
    const person = await knex('person').where({ id: ownerId });

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

    const petOwnerDetails: PetOwner = {
      ownerId,
      petId: +newPet[0].id,
    };

    const newPetOwner = await knex('pet_owner')
      .insert(petOwnerDetails)
      .returning('*');

    const newPetOwnerDetails = await knex('pet_owner')
      .where({ ownerId: newPetOwner[0].ownerId, petId: newPetOwner[0].petId })
      .join('person', { ownerId: 'person.id' })
      .select('ownerId', 'person.firstName', 'person.lastName')
      .join('pet', { petId: 'pet.id' })
      .select('petId', 'pet.name')
      .join('animal', { animalId: 'animal.id' })
      .select('animal.type');

    res.status(200);
    res.send(newPetOwnerDetails);
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

    res.status(200);
    res.send(pets);
  } catch (err) {
    res.status(404);
    res.send({ message: 'Error fetching data.', error: err });
  }
});

// individual pet
router.get('/:petId', async (req, res) => {
  try {
    const pet = await knex('pet').where({ id: +req.params.petId });

    if (!pet.length) {
      res.status(404);
      res.send({ message: 'Pet not found.' });
      return;
    }

    res.status(200);
    res.send(pet);
  } catch (err) {
    res.status(500);
    res.send({ message: 'Error fetching pet data.', error: err });
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
// update pet data
router.put('/:petId', async (req, res) => {
  try {
    const pet = await knex('pet').where({ id: +req.params.petId });

    if (!pet.length) {
      res.status(404);
      res.send({ message: 'Pet not found.' });
      return;
    }

    const updatedPetDetails: Pet = { ...req.body };

    const updatedPet = await knex('pet')
      .where({ id: +req.params.petId })
      .update(updatedPetDetails)
      .returning('*');

    res.status(200);
    res.send(updatedPet);
  } catch (err) {
    res.status(500);
    res.send({ message: 'Error updating pet data.', error: err });
  }
});

// update pet data for new owner
router.put('/:petId/persons/:personId', async (req, res) => {
  const ownerId = +req.params.personId;
  const petId = +req.params.petId;

  try {
    const pet = await knex('pet').where({ id: petId });

    if (!pet.length) {
      res.status(404);
      res.send({ message: 'Pet not found.' });
      return;
    }

    const owner = await knex('pet_owner').where({ ownerId, petId });

    if (!owner.length) {
      res.status(500);
      res.send({ message: 'Person not owner of pet.' });
      return;
    }

    const updatedPetOwnerDetails: PetOwner = { ...req.body };

    const updatedPetOwner = await knex('pet_owner')
      .where({ ownerId, petId })
      .update(updatedPetOwnerDetails)
      .returning('*');

    res.status(200);
    res.send(updatedPetOwner);
  } catch (err) {
    res.status(500);
    res.send({ message: 'Error updating pet data.', error: err });
  }
});

// DELETE
// delete pet from all owners
router.delete('/:petId', async (req, res) => {
  const petId = +req.params.petId;

  try {
    const pet = await knex('pet').where({ id: petId });

    if (!pet.length) {
      res.status(404);
      res.send({ message: 'Pet not found.' });
      return;
    }

    await knex('pet_owner').where({ petId }).del();
    await knex('pet').where({ id: petId }).del();

    res.status(200);
    res.send({ message: 'Pet data deletion successful.' });
  } catch (err) {
    res.status(500);
    res.send({ message: 'Error deleting pet data.', error: err });
  }
});

// delete pet from a specific owner
router.delete('/:petId/persons/:personId', async (req, res) => {
  const ownerId = +req.params.personId;
  const petId = +req.params.petId;

  try {
    const pet = await knex('pet').where({ id: petId });

    if (!pet.length) {
      res.status(404);
      res.send({ message: 'Pet not found.' });
      return;
    }

    const owner = await knex('pet_owner').where({ ownerId, petId });

    if (!owner.length) {
      res.status(500);
      res.send({ message: 'Person not owner of pet.' });
      return;
    }

    await knex('pet_owner').where({ ownerId, petId }).del();

    res.status(200);
    res.send({ message: 'Pet data deletion successful.' });
  } catch (err) {
    res.status(500);
    res.send({ message: 'Error deleting pet data.', error: err });
  }
});

export const petRouter = router;
