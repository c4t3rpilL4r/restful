import { Request, Response } from 'express';
import { Animal, Pagination, Pet, PetOwner } from '@app/models';
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

const getAll = async (req: Request, res: Response) => {
  try {
    let pagination: Pagination;
    let pets: any[] = [];
    const ownerId = req.query.ownerId ? +req.query.ownerId : 0;

    if (req.query.page && req.query.limit) {
      pagination = {
        page: +req.query.page,
        limit: +req.query.limit,
      };

      pets = await petOwnerService.getByPage(pagination);
    } else if (ownerId) {
      pets = await petOwnerService.getByOwnerId(ownerId);
    } else {
      pets = await petOwnerService.getAll();
    }

    res.status(200).send(pets);
  } catch (err) {
    res.status(500).send({ message: 'Error fetching pets data.', error: err });
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const petId = +req.params.petId;
    const pet = await petOwnerService.getByPetId(petId);

    res.status(200).send(pet);
  } catch (err) {
    res.status(500).send({ message: 'Error fetching pet data.', error: err });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const petId = +req.params.petId;
    const pet = await petService.getById(petId);

    if (!pet.length) {
      res.status(404).send({ message: 'Pet not found.' });
      return;
    }

    if (req.query.ownerId) {
      const currentOwner: PetOwner = {
        ownerId: +req.query.ownerId,
        petId,
      };

      await petOwnerService.deletePetAndOwner(currentOwner);

      if (req.body.ownerId && +req.body.ownerId !== currentOwner.ownerId) {
        const newOwner: PetOwner = {
          ownerId: +req.body.ownerId,
          petId,
        };

        await petOwnerService.create(newOwner);
      }
    }

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

    if (req.query.ownerId) {
    } else {
      await petService.deleteById(petId);
    }

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
  getAll,
  getById,
  update,
  deleteById,
};
