import express from 'express';
import { animalController } from '@app/controllers';

const router = express.Router();

// CREATE
router.post('/animals', animalController.create);

// READ
router.get('/animals', animalController.get);
router.get('/animals/:animalId', animalController.getById);

// UPDATE
router.put('/animals/:animalId');

// DELETE
router.delete('/animals/:animalId');

export const animalRouter = router;
