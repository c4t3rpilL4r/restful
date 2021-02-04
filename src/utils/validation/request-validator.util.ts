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

const checkPetOwnerIfExisting: RequestHandler = async (req, res, next) => {
  try {
    const ownerId = req.query.ownerId ?? req.params.ownerId ?? req.body.ownerId;
    const petId = req.query.petId ?? req.params.petId ?? req.body.petId;

    const pets = await petService.getByOwnerId(+ownerId);

    if (!pets.length) {
      error.message = 'Person does not own any pet.';
      next(error);
    }

    const found = pets.find((pet) => {
      if (!pet.id) {
        return;
      }

      return pet.id === +petId;
    });

    if (!found) {
      error.message = 'Pet not owned by person.';
      next(error);
    }

    next();
  } catch (err) {
    res
      .status(500)
      .send({ message: 'Error verifying pet and owner.', error: err });
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

const checkAnimalTypeIfExisting: RequestHandler = async (req, res, next) => {
  try {
    const { type } = req.body;
    const animal = await animalService.getByType(type);

    if (animal) {
      error.code = 409;
      error.message = 'Animal type already existing in db.';
      next(error);
    }

    next();
  } catch (err) {
    res
      .status(500)
      .send({ message: 'Error verifying animal type.', error: err });
  }
};

export const requestValidator = {
  checkPersonIfExisting,
  checkPetIfExisting,
  checkPetOwnerIfExisting,
  checkAnimalIfExisting,
  checkAnimalTypeIfExisting,
};
