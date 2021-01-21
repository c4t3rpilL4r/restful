import express from 'express';
import { animalController } from '@app/controllers';

const router = express.Router();

// CREATE
router.post('/animals', animalController.create);

// READ
// all animals
// router.get('/animals', async (req, res) => {
//   try {
//     const animals = await knex('animal').select();

//     res.status(200).send(animals);
//   } catch (err) {
//     res.status(404).send({ message: 'Error fetching data.', error: err });
//   }
// });

// individual animal
// router.get('/animals/:animalId', async (req, res) => {
//   try {
//     const animal = await knex('animal').where({ id: +req.params.animalId });

//     res.status(201).send(animal);
//   } catch (err) {
//     res.status(404).send({ message: 'Animal not found.', error: err });
//   }
// });

// UPDATE
// router.put('/animals/:animalId', async (req, res) => {
//   try {
//     const animal = await knex('animal').where({ id: +req.params.animalId });

//     if (!animal.length) {
//       res.status(404);
//       res.send({ message: 'Animal not found.' });
//       return;
//     }

//     const updatedAnimalDetails: Animal = { ...req.body };

//     const updatedAnimal = await knex('animal')
//       .where({ id: +req.params.id })
//       .update(updatedAnimalDetails)
//       .returning('*');

//     res.status(200).send(updatedAnimal);
//   } catch (err) {
//     res
//       .status(500)
//       .send({ message: 'Error updating animal data.', error: err });
//   }
// });

// DELETE
// router.delete('/:animalId', async (req, res) => {
//   try {
//     const animal = await knex('animal').where({ id: +req.params.animalId });

//     if (!animal.length) {
//       res.status(404);
//       res.send({ message: 'Animal not found.' });
//       return;
//     }

//     await knex('animal')
//       .where({ id: +req.params.animalId })
//       .del();

//     res.status(200).send({ message: 'Animal data deletion successful.' });
//   } catch (err) {
//     res
//       .status(500)
//       .send({ message: 'Error deleting animal data.', error: err });
//   }
// });

export const animalRouter = router;
