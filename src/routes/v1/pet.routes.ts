import { requestValidator } from '@app/utils';
import express from 'express';
import { petController } from '@app/controllers';

const router = express.Router();

// CREATE
router.post(
  '/pets',
  requestValidator.checkPersonIfExisting,
  petController.create,
);

// READ
router.get('/pets', petController.getPaginated);
router.get(
  '/pets/:petId',
  requestValidator.checkPetIfExisting,
  petController.getById,
);

// UPDATE
router.put(
  '/pets/:petId',
  requestValidator.checkPetIfExisting,
  petController.update,
);

// DELETE
router.delete(
  '/pets/:petId',
  requestValidator.checkPetIfExisting,
  petController.deleteById,
);

export const petRouter = router;
