import express from 'express';
import { personController } from '@app/controllers';

const router = express.Router();

// CREATE
router.post('/persons', personController.create);

// READ
router.get('/persons', personController.get);
router.get('/persons/:personId', personController.getById);

// UPDATE
router.put('/persons/:personId', personController.update);

// DELETE
router.delete('/persons/:personId', personController.deleteById);

export const personRouter = router;
