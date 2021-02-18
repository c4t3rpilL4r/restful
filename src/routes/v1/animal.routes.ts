import { requestValidator } from '@app/utils';
import express from 'express';
import { animalController } from '@app/controllers';

const router = express.Router();

// CREATE
router.post('/animals', animalController.create);

// READ
router.get('/animals', animalController.getPaginated);
router.get(
  '/animals/:animalId',
  requestValidator.checkAnimalIfExisting,
  animalController.getById,
);

// UPDATE
router.put(
  '/animals/:animalId',
  requestValidator.checkAnimalIfExisting,
  animalController.update,
);

// DELETE
router.delete(
  '/animals/:animalId',
  requestValidator.checkAnimalIfExisting,
  animalController.deleteById,
);

export const animalRouter = router;
