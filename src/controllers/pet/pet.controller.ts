import { RequestHandler } from 'express';
import { Animal, Pet, PetOwner } from '@app/models';
import {
  animalService,
  personService,
  petOwnerService,
  petService,
} from '@app/services';

const create: RequestHandler = async (req, res) => {
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

const getAll: RequestHandler = async (req, res) => {
  try {
    const { page, limit, showOwnerId, ownerId } = req.query as any;
    let pets: Pet[];

    if (showOwnerId || ownerId) {
      pets = await petOwnerService.getByPage(page, limit, showOwnerId, ownerId);
    } else {
      pets = await petService.getByPage(page, limit);
    }

    res.status(200).send(pets);
  } catch (err) {
    res.status(500).send({ message: 'Error fetching pets data.', error: err });
  }
};

const getById: RequestHandler = async (req, res) => {
  try {
    const petId = +req.params.petId;
    const pet = await petService.getById(petId);
    // const pet = await petOwnerService.getByPetId(petId);

    res.status(200).send(pet);
  } catch (err) {
    res.status(500).send({ message: 'Error fetching pet data.', error: err });
  }
};

const update: RequestHandler = async (req, res) => {
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

const deleteByOwnerId: RequestHandler = async (req, res) => {
  try {
    if (req.query.ownerId) {
      const ownerId = +req.query.ownerId;
      const owner = await personService.getById(ownerId);

      if (!owner.length) {
        res.status(404).send({ message: 'Person not found.' });
        return;
      }

      const petOwner = await petOwnerService.getByOwnerId(ownerId);

      if (!petOwner.length) {
        res.status(404).send({ message: 'Person does not own pet.' });
        return;
      }

      await petOwnerService.deleteByOwnerId(ownerId);

      res.status(200).send({ message: 'Pets deletion successful.' });
    } else {
      res.status(500).send({ message: 'Owner ID is needed.' });
    }
  } catch (err) {
    res.status(500).send({
      message: 'Error deleting pet data.',
      error: err,
    });
  }
};

const deleteById: RequestHandler = async (req, res) => {
  try {
    const petId = +req.params.petId;
    const pet = await petService.getById(petId);

    if (!pet.length) {
      res.status(404).send({ message: 'Pet not found.' });
      return;
    }

    if (req.query.ownerId) {
      if (+req.query.ownerId > 0) {
        const petOwner: PetOwner = {
          ownerId: +req.query.ownerId,
          petId,
        };

        await petOwnerService.deletePetAndOwner(petOwner);
      } else {
        await petOwnerService.deleteByPetId(petId);
      }
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
  getAll,
  getById,
  update,
  deleteByOwnerId,
  deleteById,
};
