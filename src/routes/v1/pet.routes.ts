import express from 'express';
import { petController } from '@app/controllers';

const router = express.Router();

// CREATE
router.post('/pets', petController.create);

// READ
router.get('/pets', petController.getAll);
router.get('/pets/:petId', petController.getById);

// UPDATE
router.put('/pets/:petId', petController.update);

// DELETE
router.delete('/pets', petController.deleteByOwnerId);
router.delete('/pets/:petId', petController.deleteById);

export const petRouter = router;
