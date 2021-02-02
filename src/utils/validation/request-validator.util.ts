import { IError } from '@app/interfaces';
import { PersonPet, Pet } from 'src/db_pg/models';
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

    if (!person.length) {
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

    if (!pet.length) {
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

    const found = pets.find((ownerPet: Pet) => {
      if (!ownerPet.id) {
        return;
      }

      return +ownerPet.id === +petId;
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
    const animalId = +req.params.animalId;
    const animal = await animalService.getById(animalId);

    if (!animal.length) {
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

    if (animal.length) {
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
