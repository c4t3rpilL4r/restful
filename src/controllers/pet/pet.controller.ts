import { RequestHandler } from 'express';
import { Animal, Pet, PetOwner } from '@app/models';
import { animalService, petService, personService } from '@app/services';

const create: RequestHandler = async (req, res) => {
  try {
    const { ownerId, name, animalType } = req.body;
    let animal = await animalService.getByType(animalType);

    if (!animal.length) {
      const newAnimalDetails: Animal = {
        type: animalType,
      };

      animal = await animalService.create(newAnimalDetails);
    }

    const newPetDetails: Pet = {
      ownerId,
      name,
      animalId: animal[0].id,
    };

    const newPet = await petService.create(newPetDetails);

    res.status(200).send(newPet);
  } catch (err) {
    res.status(500).send({ message: 'Error creating pet data.', error: err });
  }
};

const addOwnerToPet: RequestHandler = async (req, res) => {
  try {
    const petId = +req.params.petId;
    const pet = await petService.getById(petId);

    const ownerId = +req.body.ownerId;
    const owner = await personService.getById(ownerId);

    const newPetOwner: PetOwner = {
      owner: owner[0],
      pet: pet[0],
    };

    const petOwner = await petService.addOwnerToPet(newPetOwner);

    res.status(200).send(petOwner);
  } catch (err) {
    res.status(500).send({ message: 'Error adding owner to pet.', error: err });
  }
};

const getAll: RequestHandler = async (req, res) => {
  try {
    const { page, limit, includeOwnerId, ownerId } = req.query as any;
    let pets: Pet[];

    if (ownerId) {
      pets = await petService.getByOwnerId(
        ownerId,
        includeOwnerId,
        page,
        limit,
      );
    } else if (includeOwnerId) {
      pets = await petService.getAllIncludingOwnerId(page, limit);
    } else {
      pets = await petService.getAll(page, limit);
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

    res.status(200).send(pet);
  } catch (err) {
    res.status(500).send({ message: 'Error fetching pet data.', error: err });
  }
};

const update: RequestHandler = async (req, res) => {
  try {
    const petId = +req.params.petId;
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

const deleteById: RequestHandler = async (req, res) => {
  try {
    const { ownerId } = req.query as any;
    const petId = +req.params.petId;

    if (ownerId) {
      await petService.deletePetAndOwner(petId, +ownerId);
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

const deleteByOwnerId: RequestHandler = async (req, res) => {
  try {
    const { ownerId } = req.query as any;

    await petService.deleteByOwnerId(ownerId);

    res.status(200).send({ message: 'Pets deletion successful.' });
  } catch (err) {
    res.status(500).send({
      message: 'Error deleting pet data.',
      error: err,
    });
  }
};

export const petController = {
  create,
  addOwnerToPet,
  getAll,
  getById,
  update,
  deleteById,
  deleteByOwnerId,
};
