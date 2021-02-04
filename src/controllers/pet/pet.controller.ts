import { RequestHandler } from 'express';
import { Pet, PersonPet } from '@app/models';
import { petService } from '@app/services';
import { IPet } from '@app/interfaces';

const create: RequestHandler = async (req, res) => {
  try {
    const { ownerId, name, animalId } = req.body;

    const newPetDetails: IPet = {
      name,
      animalId,
    };
    const createdPet = await petService.create(newPetDetails);

    const newPetOwner: PersonPet = {
      ownerId,
      petId: createdPet.id,
    };
    await petService.addOwnerToPet(newPetOwner);

    res.status(200).send(createdPet);
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
    const addedPetOwner = await petService.addOwnerToPet(newPetOwner);

    res.status(200).send(addedPetOwner);
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

    const petNewDetails: Pet = {
      id: petId,
      ...req.body,
    };
    const updatedPetDetails = await petService.update(petNewDetails);

    res.status(200).send(updatedPetDetails);
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
    let isDeleted: boolean;

    if (ownerId) {
      isDeleted = await petService.deleteOwnership(+ownerId, petId);
    } else {
      isDeleted = await petService.deleteById(petId);
    }

    const message = isDeleted
      ? 'Pets deletion successful.'
      : 'Pets deletion failed.';

    res.status(200).send({ message });
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
    const isDeleted = await petService.deleteOwnership(+ownerId);
    const message = isDeleted
      ? 'Pets deletion successful.'
      : 'Pets deletion failed.';

    res.status(200).send({ message });
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
