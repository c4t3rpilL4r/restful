import express from 'express';
import { personController } from '@app/controllers';
import { requestValidator } from '@app/utils';

const router = express.Router();

// CREATE
router.post('/persons', personController.create);

// READ
router.get('/persons', personController.getPaginated);
router.get(
  '/persons/:personId',
  requestValidator.checkPersonIfExisting,
  personController.getById,
);

// UPDATE
router.put(
  '/persons/:personId',
  requestValidator.checkPersonIfExisting,
  personController.update,
);

// DELETE
router.delete(
  '/persons/:personId',
  requestValidator.checkPersonIfExisting,
  personController.deleteById,
);

export const personRouter = router;
