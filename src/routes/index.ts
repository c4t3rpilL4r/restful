import { Express } from 'express';
import { routes as v1Routes } from './v1/index';

export const initRoutes = (app: Express) => {
  app.use('/v1', v1Routes);
};
