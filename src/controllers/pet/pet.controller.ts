import { RequestHandler } from 'express';
import { Pet, PersonPet, Animal } from '@app/models';
import { animalService, petService } from '@app/services';
import { IAnimal, IPet } from '@app/interfaces';

const create: RequestHandler = async (req, res) => {
  try {
    const { ownerId, name, animalType } = req.body;
    let animal: Animal = await animalService.getByType(animalType);

    if (!animal) {
      const newAnimalDetails: IAnimal = {
        type: animalType,
      };

      animal = await animalService.create(newAnimalDetails);
    }

    const newPetDetails: IPet = {
      name,
      animalId: animal.id,
    };

    const newPet = await petService.create(newPetDetails);

    const newPersonPetDetails: PersonPet = {
      ownerId,
      petId: newPet.id,
    };

    await petService.addOwnerToPet(newPersonPetDetails);

    res.status(200).send(newPet);
  } catch (err) {
    res.status(500).send({ message: 'Error creating pet data.', error: err });
  }
};

const addOwnerToPet: RequestHandler = async (req, res) => {
  try {
    const petId = +req.params.petId;
    const ownerId = +req.body.ownerId;

    const newPetOwner: PersonPet = {
      ownerId,
      petId,
    };

    const petOwner = await petService.addOwnerToPet(newPetOwner);

    res.status(200).send(petOwner);
  } catch (err) {
    res.status(500).send({ message: 'Error adding owner to pet.', error: err });
  }
};

const getAll: RequestHandler = async (req, res) => {
  try {
    const { page, limit, ownerId } = req.query as any;
    let pets: Pet[];

    if (ownerId) {
      pets = await petService.getByOwnerId(ownerId, page, limit);
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
      await petService.deleteOwnership(+ownerId, petId);
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

const deleteOwnership: RequestHandler = async (req, res) => {
  try {
    const { ownerId } = req.query as any;

    await petService.deleteOwnership(+ownerId);

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
  deleteByOwnerId: deleteOwnership,
};
