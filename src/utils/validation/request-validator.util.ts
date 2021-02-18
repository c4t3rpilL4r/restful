import { IError } from '@app/interfaces';
import { personService, petService, animalService } from '@app/services';
import { RequestHandler } from 'express';

const error: IError = {
  code: 404,
};

const checkPersonIfExisting: RequestHandler = async (req, res, next) => {
  try {
    const personId =
      req.query.personId ??
      req.params.personId ??
      req.body.personId ??
      req.query.ownerId ??
      req.params.ownerId ??
      req.body.ownerId;
    const person = await personService.getById(+personId);

    if (!person) {
      error.message = 'Person not found.';

      next(error);
    }

    next();
  } catch (err) {
    res.status(500).send({ message: 'Error verifying person.', error: err });
  }
};

const checkPetIfExisting: RequestHandler = async (req, res, next) => {
  try {
    const petId = req.query.petId ?? req.params.petId ?? req.body.petId;
    const pet = await petService.getById(+petId);

    if (!pet) {
      error.message = 'Pet not found.';
      next(error);
    }

    next();
  } catch (err) {
    res.status(500).send({ message: 'Error verifying pet.', error: err });
  }
};

const checkAnimalIfExisting: RequestHandler = async (req, res, next) => {
  try {
    const animalId =
      req.params.animalId ?? req.query.animalId ?? req.body.animalId;
    const animal = await animalService.getById(+animalId);

    if (!animal) {
      error.message = 'Animal not found.';
      next(error);
    }

    next();
  } catch (err) {
    res.status(500).send({ message: 'Error verifying animal.', error: err });
  }
};

export const requestValidator = {
  checkPersonIfExisting,
  checkPetIfExisting,
  checkAnimalIfExisting,
};
