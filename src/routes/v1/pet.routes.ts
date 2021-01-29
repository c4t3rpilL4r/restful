import { requestValidator } from '@app/utils';
import express from 'express';
import { petController } from '@app/controllers';

const router = express.Router();

// CREATE
router.post('/pets', petController.create);
router.post(
  '/pets/:petId',
  requestValidator.checkPersonIfExisting,
  requestValidator.checkPetIfExisting,
  petController.addOwner,
);

// READ
router.get('/pets', petController.getAll);
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
  '/pets',
  requestValidator.checkPetOwnerIfExisting,
  petController.deleteByOwnerId,
);
router.delete(
  '/pets/:petId',
  requestValidator.checkPetIfExisting,
  requestValidator.checkPetOwnerIfExisting,
  petController.deleteById,
);

export const petRouter = router;
