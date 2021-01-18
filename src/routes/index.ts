import { Express } from 'express';
import { animalRouter } from './animal.routes';
import { personRouter } from './person.routes';
import { petRouter } from './pet.routes';

export const initRoutes = (app: Express) => {
  app.use('/persons', personRouter);
  app.use('/pets', petRouter);
  app.use('/animals', animalRouter);
};
