import { IError } from '@app/interfaces';
import { PetOwner } from '@app/models';
import {
  personService,
  petService,
  petOwnerService,
  animalService,
} from '@app/services';
import { RequestHandler } from 'express';

// const checkIfExisting: RequestHandler = async (req, res, next) => {
//   try {
//     const {
//       personId: queryPersonId,
//       ownerId: queryOwnerId,
//       petId: queryPetId,
//     } = req.query as any;
//     const {
//       personId: paramsPersonId,
//       ownerId: paramsOwnerId,
//       petId: paramsPetId,
//     } = req.params;
//     const {
//       personId: bodyPersonId,
//       ownerId: bodyOwnerId,
//       petId: bodyPetId,
//     } = req.body;

//     const ownerId =
//       queryPersonId ??
//       queryOwnerId ??
//       paramsPersonId ??
//       paramsOwnerId ??
//       bodyPersonId ??
//       bodyOwnerId;
//     const petId = queryPetId ?? paramsPetId ?? bodyPetId;

//     const error: IError = {
//       code: 404,
//     };

//     const person = await personService.getById(ownerId);

//     if (!person.length) {
//       error.message = 'Person not found.';

//       next(error);
//     }

//     const pet = await petService.getById(petId);

//     if (!pet.length) {
//       error.message = 'Pet not found';

//       next(error);
//     }

//     const petOwnerDetails: PetOwner = {
//       ownerId,
//       petId,
//     };
//     const petOwner = await petOwnerService.getPetAndOrOwner(petOwnerDetails);

//     if (!petOwner.length) {
//       error.message = 'Pet or owner not found.';

//       next(error);
//     }

//     next();
//   } catch (err) {
//     res.status(500).send({ message: 'Error verifying data.', error: err });
//   }
// };

// export const requestValidator = { checkIfExisting };

const error: IError = {
  code: 404,
};

const checkPersonIfExisting: RequestHandler = async (req, res, next) => {
  try {
    const personId =
      req.query.personId ?? req.params.personId ?? req.body.personId;
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
    const owner = await personService.getById(+ownerId);

    if (!ownerId || !owner.length) {
      error.message = 'Person not found.';
      next(error);
    }

    const petId = req.query.petId ?? req.params.petId ?? req.body.petId;
    const pet = await petService.getById(+petId);

    if (!petId || !pet.length) {
      error.message = 'Pet not found.';
      next(error);
    }

    const petOwnerDetails: PetOwner = {
      ownerId: +ownerId,
      petId: +petId,
    };

    const petOwner = await petOwnerService.getPetAndOrOwner(petOwnerDetails);

    if (!petOwner.length) {
      error.message = 'Pet or owner not found.';
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
    const { animalType } = req.body;
    const animal = await animalService.getByType(animalType);

    if (animal.length) {
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
