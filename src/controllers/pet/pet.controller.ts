import { Request, Response } from 'express';
import { Animal, Pet, PetOwner } from '@app/models';
import {
  animalService,
  personService,
  petOwnerService,
  petService,
} from '@app/services';

const create = async (req: Request, res: Response) => {
  try {
    const personId = +req.body.personId;
    const person = await personService.getById(personId);

    if (!person.length) {
      res.status(404).send({ message: 'Person not found.' });
      return;
    }

    const animalType = req.body.animalType;
    let animal = await animalService.getByType(animalType);

    if (!animal.length) {
      const newAnimalDetails: Animal = {
        type: animalType,
      };

      animal = await animalService.create(newAnimalDetails);
    }

    const newPetDetails: Pet = {
      name: req.body.name,
      animalId: animal[0].id,
    };

    const newPet = await petService.create(personId, newPetDetails);

    res.status(200).send(newPet);
  } catch (err) {
    res.status(500).send({ message: 'Error creating pet data.', error: err });
  }
};

const get = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? +req.query.page : 0;
    const limit = req.query.limit ? +req.query.limit : 0;
    const ownerId = req.query.ownerId ? +req.query.ownerId : 0;

    const pets = await petService.getAll(ownerId, page, limit);

    res.status(200).send(pets);
  } catch (err) {
    res.status(500).send({ message: 'Error fetching pets data.', error: err });
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const petId = +req.params.petId;
    const pet = await petService.getById(petId);

    res.status(200).send(pet);
  } catch (err) {
    res.status(500).send({ message: 'Error fetching pet data.', error: err });
  }
};

// to update on a specific owner
// /v1/pets?ownerId=id
// to update on all owners
// /v1/pets?ownerId=all
const update = async (req: Request, res: Response) => {
  try {
    const petId = +req.params.petId;
    const pet = await petService.getById(petId);

    if (!pet.length) {
      res.status(404).send({ message: 'Pet not found.' });
      return;
    }

    const ownerId = req.body.ownerId;

    if (ownerId) {
      const person = await personService.getById(ownerId);

      if (!person.length) {
        res.status(404).send({ message: 'Person not found.' });
        return;
      }
    }

    // const ownerId = req.query.ownerId;

    // if (ownerId) {
    //   const newPetOwnerDetails: PetOwner = {
    //     ...req.body,
    //   };

    //   if (+ownerId > 0) {
    //     const oldPetOwnerDetails: PetOwner = {
    //       ownerId: +ownerId,
    //       petId,
    //     };

    //     await petOwnerService.updateByOwnerId(
    //       oldPetOwnerDetails,
    //       newPetOwnerDetails,
    //     );
    //   } else {
    //     const petOwnerDetails: PetOwner = {
    //       ...req.body,
    //     };

    //     await petOwnerService.update(petOwnerDetails);
    //   }
    // }

    const updatedPetDetails: Pet = {
      id: petId,
      ...req.body,
    };

    const updatedPet = await petService.update(updatedPetDetails);

    res.status(200).send(updatedPet);
  } catch (err) {
    res.status(500).send({
      message: 'Error updating pet data.',
      error: err,
    });
  }
};

const deleteById = async (req: Request, res: Response) => {
  try {
    const petId = +req.params.petId;
    const pet = await petService.getById(petId);

    if (!pet.length) {
      res.status(404).send({ message: 'Pet not found.' });
      return;
    }

    await petService.deleteById(petId);

    res.status(200).send({ message: 'Pet deletion successful.' });
  } catch (err) {
    res.status(500).send({
      message: 'Error deleting pet data.',
      error: err,
    });
  }
};

export const petController = {
  create,
  get,
  getById,
  update,
  deleteById,
};
