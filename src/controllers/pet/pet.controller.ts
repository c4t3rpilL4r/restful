import { RequestHandler } from 'express';
import { Pet } from '@app/models';
import { petService } from '@app/services';
import { IPet } from '@app/interfaces';

const create: RequestHandler = async (req, res) => {
  try {
    const { ownerId, name, animalId } = req.body;
    const newPetDetails: IPet = {
      name,
      animalId,
    };
    const createdPet = await petService.create(newPetDetails, ownerId);

    res.status(201).send(createdPet);
  } catch (err) {
    res.status(500).send({ message: 'Error creating pet data.', error: err });
  }
};

const getPaginated: RequestHandler = async (req, res) => {
  try {
    const { page, limit } = req.query as any;
    const pets = await petService.getPaginated(page, limit);

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
    const petId = +req.params.petId;
    const isDeleted = await petService.deleteById(petId);

    const message = isDeleted
      ? 'Pet deletion successful.'
      : 'Pet deletion failed.';

    res.status(204).send({ message });
  } catch (err) {
    res.status(500).send({
      message: 'Error deleting pet data.',
      error: err,
    });
  }
};

export const petController = {
  create,
  getPaginated,
  getById,
  update,
  deleteById,
};
