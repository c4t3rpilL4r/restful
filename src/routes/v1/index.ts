import { animalRouter } from './animal.routes';
import { personRouter } from './person.routes';
import { petRouter } from './pet.routes';

export const routes = [personRouter, petRouter, animalRouter];
