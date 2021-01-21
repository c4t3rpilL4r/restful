import knex from '../../db_pg/knex-config';
import express from 'express';
import { Animal, Pet, PetOwner } from '@app/models';
import { petController } from '@app/controllers';

const router = express.Router();

// CREATE
router.post('/pets', petController.create);

// READ
router.get('/pets', petController.get);
// router.post('/pets', async (req, res) => {
//   const ownerId = +req.body.personId;

//   try {
//     const person = await knex('person').where({ id: ownerId });

//     if (!person.length) {
//       res.status(404).send({ message: 'Person not found.' });
//       return;
//     }

//     let animal = await knex('animal').where({ type: req.body.animalType });

//     if (!animal.length) {
//       const newAnimal: Animal = {
//         type: req.body.animalType,
//       };

//       animal = await knex('animal').insert(newAnimal).returning('*');
//     }

//     const pet: Pet = {
//       name: req.body.name,
//       animalId: animal[0].id,
//     };

//     const newPet = await knex('pet').insert(pet).returning('*');

//     const petOwnerDetails: PetOwner = {
//       ownerId,
//       petId: +newPet[0].id,
//     };

//     const newPetOwner = await knex('pet_owner')
//       .insert(petOwnerDetails)
//       .returning('*');

//     const newPetOwnerDetails = await knex('pet_owner')
//       .where({ ownerId: newPetOwner[0].ownerId, petId: newPetOwner[0].petId })
//       .join('person', { ownerId: 'person.id' })
//       .select('ownerId', 'person.firstName', 'person.lastName')
//       .join('pet', { petId: 'pet.id' })
//       .select('petId', 'pet.name')
//       .join('animal', { animalId: 'animal.id' })
//       .select('animal.type');

//     res.status(200).send(newPetOwnerDetails);
//   } catch (err) {
//     res.status(500).send({ message: 'Error creating pet.', error: err });
//   }
// });

// READ
// all pets
// router.get('/pets', async (req, res) => {
//   try {
//     const pets = await knex('pet_owner')
//       .join('person', { ownerId: 'person.id' })
//       .select('ownerId', 'person.firstName', 'person.lastName')
//       .join('pet', { petId: 'pet.id' })
//       .select('pet.id', 'pet.name')
//       .join('animal', { animalId: 'animal.id' })
//       .select('animal.type');

//     res.status(200).send(pets);
//   } catch (err) {
//     res.status(404).send({ message: 'Error fetching data.', error: err });
//   }
// });

// individual pet
// router.get('/pets/:petId', async (req, res) => {
//   try {
//     const pet = await knex('pet').where({ id: +req.params.petId });

//     if (!pet.length) {
//       res.status(404).send({ message: 'Pet not found.' });
//       return;
//     }

//     res.status(200).send(pet);
//   } catch (err) {
//     res.status(500).send({ message: 'Error fetching pet data.', error: err });
//   }
// });

// fetch owners of pet
router.get('/pets/:petId/owner', async (req, res) => {
  try {
    const pet = await knex('pet_owner').where({ petId: +req.params.petId });

    if (!pet.length) {
      res.status(404).send({ message: 'Pet not found.' });
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

    res.status(200).send(owner);
  } catch (err) {
    res
      .status(500)
      .send({ message: 'Error fetching owners of pet.', error: err });
  }
});

// UPDATE
// update pet data
router.put('/pets/:petId', async (req, res) => {
  try {
    const pet = await knex('pet').where({ id: +req.params.petId });

    if (!pet.length) {
      res.status(404).send({ message: 'Pet not found.' });
      return;
    }

    const updatedPetDetails: Pet = { ...req.body };

    const updatedPet = await knex('pet')
      .where({ id: +req.params.petId })
      .update(updatedPetDetails)
      .returning('*');

    res.status(200).send(updatedPet);
  } catch (err) {
    res.status(500).send({ message: 'Error updating pet data.', error: err });
  }
});

// update pet data for new owner
router.put('/pets/:petId/persons/:personId', async (req, res) => {
  const ownerId = +req.params.personId;
  const petId = +req.params.petId;

  try {
    const pet = await knex('pet').where({ id: petId });

    if (!pet.length) {
      res.status(404).send({ message: 'Pet not found.' });
      return;
    }

    const owner = await knex('pet_owner').where({ ownerId, petId });

    if (!owner.length) {
      res.status(500).send({ message: 'Person not owner of pet.' });
      return;
    }

    const updatedPetOwnerDetails: PetOwner = { ...req.body };

    const updatedPetOwner = await knex('pet_owner')
      .where({ ownerId, petId })
      .update(updatedPetOwnerDetails)
      .returning('*');

    res.status(200).send(updatedPetOwner);
  } catch (err) {
    res.status(500).send({ message: 'Error updating pet data.', error: err });
  }
});

// DELETE
// delete pet from all owners
router.delete('/pets/:petId', async (req, res) => {
  const petId = +req.params.petId;

  try {
    const pet = await knex('pet').where({ id: petId });

    if (!pet.length) {
      res.status(404).send({ message: 'Pet not found.' });
      return;
    }

    await knex('pet_owner').where({ petId }).del();
    await knex('pet').where({ id: petId }).del();

    res.status(200).send({ message: 'Pet data deletion successful.' });
  } catch (err) {
    res.status(500).send({ message: 'Error deleting pet data.', error: err });
  }
});

// delete pet from a specific owner
router.delete('/:petId/persons/:personId', async (req, res) => {
  const ownerId = +req.params.personId;
  const petId = +req.params.petId;

  try {
    const pet = await knex('pet').where({ id: petId });

    if (!pet.length) {
      res.status(404).send({ message: 'Pet not found.' });
      return;
    }

    const owner = await knex('pet_owner').where({ ownerId, petId });

    if (!owner.length) {
      res.status(500).send({ message: 'Person not owner of pet.' });
      return;
    }

    await knex('pet_owner').where({ ownerId, petId }).del();

    res.status(200).send({ message: 'Pet data deletion successful.' });
  } catch (err) {
    res.status(500).send({ message: 'Error deleting pet data.', error: err });
  }
});

export const petRouter = router;
