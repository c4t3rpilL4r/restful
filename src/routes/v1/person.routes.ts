import knex from '../../db_pg/knex-config';
import express from 'express';
import { Person } from '@app/models';
import { personService } from '@app/services';
import { personController } from '@app/controllers';

const router = express.Router();

// CREATE
router.post('/persons', personController.create);

// READ
router.get('/persons', personController.get);
router.get('/persons/:personId', personController.getById);

// READ
// router.get('/persons', async (req, res) => {
//   try {
//     const data = await personController.get();
// const personId = req.query.personId ? +req.query.personId : 0;
// const petId = req.query.petId;
// const page = req.query.page ? +req.query.page : 0;
// const limit = req.query.limit ? +req.query.limit : 0;

// let data: any[];

// if (petId) {
//   data = await personController.getPetsByOwnerId(
//     personId,
//     petId.toString(),
//     page,
//     limit,
//   );
// } else {
//   data = await personController.get(personId, page, limit);
// }

//   res.status(200).send(data);
// } catch (err) {
//   res.status(500).send({ message: 'Error fetching data.', error: err });
// }
// });

// UPDATE
router.put('/persons', async (req, res) => {
  try {
    if (!req.query.personId) {
      return;
    }

    const personId = +req.query.personId;
    const person = await personController.get(personId);

    if (!person.length) {
      res.status(404).send({ message: 'Person not found.' });
      return;
    }

    const updatedPersonDetails: Person = {
      id: person[0].id,
      ...req.body,
    };

    const updatedPerson = await personService.update(updatedPersonDetails);

    res.status(200).send(updatedPerson);
  } catch (err) {
    res
      .status(500)
      .send({ message: 'Error updating person data.', error: err });
  }
});

// DELETE
router.delete('/persons', async (req, res) => {
  try {
    const personId = req.query.personId ? +req.query.personId : 0;
    const petId = req.query.petId ? +req.query.petId : 0;
    const person = await personController.get(personId);

    if (!person.length) {
      res.status(404).send({ message: 'Person not found.' });
      return;
    }

    await knex('pet_owner').where({ ownerId: personId }).del();
    await knex('person').where({ id: personId }).del();

    res.status(200).send({ message: 'Data deletion successful.' });
  } catch (err) {
    res
      .status(500)
      .send({ message: 'Error deleting person data.', error: err });
  }
});

// delete pets
// router.delete('/:personId/pets', async (req, res) => {
//   try {
//     const person = await knex('person').where({ id: +req.params.personId });

//     if (!person.length) {
//       res.status(404).send({ message: 'Person not found.' });
//       return;
//     }

//     const pets = await knex('pet_owner').where({
//       ownerId: +req.params.personId,
//     });

//     if (!pets) {
//       res.status(404).send({ message: 'Person does not own a pet.' });
//     }
//   } catch (err) {
//     res
//       .status(500)
//       .send({ message: 'Error deleting person data.', error: err });
//   }
// });

export const personRouter = router;
