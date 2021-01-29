import { RequestHandler } from 'express';
import { Animal, Pet, PetOwner } from '@app/models';
import { animalService, petOwnerService, petService } from '@app/services';

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
      name,
      animalId: animal[0].id,
    };

    const newPet = await petService.create(newPetDetails);

    const newPetOwnerDetails: PetOwner = {
      ownerId,
      petId: newPet[0].id,
    };

    const newPetOwner = await petOwnerService.create(newPetOwnerDetails);

    res.status(200).send(newPetOwner);
  } catch (err) {
    res.status(500).send({ message: 'Error creating pet data.', error: err });
  }
};

const addOwner: RequestHandler = async (req, res) => {
  try {
    const petId = +req.params.petId;
    const ownerId = +req.body.ownerId;

    const newOwnerDetails: PetOwner = {
      ownerId,
      petId,
    };

    const newPetOwner = await petOwnerService.create(newOwnerDetails);

    res.status(200).send(newPetOwner);
  } catch (err) {
    res.status(500).send({ message: 'Error adding owner to pet.', error: err });
  }
};

const getAll: RequestHandler = async (req, res) => {
  try {
    const { page, limit, showOwnerId, ownerId } = req.query as any;
    let pets: Pet[];

    if (showOwnerId || ownerId) {
      const petOwner: PetOwner = {
        ownerId,
      };

      pets = await petOwnerService.getAll(page, limit, petOwner, showOwnerId);
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
    const { ownerId } = req.query as any;
    const petId = +req.params.petId;

    if (ownerId) {
      const petOwnerDetails: PetOwner = {
        ownerId,
        petId,
      };

      const petOwner = await petOwnerService.getPetAndOrOwner(petOwnerDetails);

      res.status(200).send(petOwner);
    } else {
      const pet = await petService.getById(petId);

      res.status(200).send(pet);
    }
  } catch (err) {
    res.status(500).send({ message: 'Error fetching pet data.', error: err });
  }
};

const update: RequestHandler = async (req, res) => {
  try {
    const petId = +req.params.petId;

    if (req.query.ownerId) {
      const currentOwner: PetOwner = {
        ownerId: +req.query.ownerId,
        petId,
      };

      await petOwnerService.deletePetAndOrOwner(currentOwner);

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
    const { ownerId } = req.query as any;
    const petOwner: PetOwner = {
      ownerId: +ownerId,
    };

    await petOwnerService.deletePetAndOrOwner(petOwner);

    res.status(200).send({ message: 'Pets deletion successful.' });
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
    const { ownerId } = req.query as any;
    const petOwnerDetails: PetOwner = {
      petId,
    };

    if (ownerId) {
      petOwnerDetails.ownerId = ownerId;
    }

    await petOwnerService.deletePetAndOrOwner(petOwnerDetails);
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
  addOwner,
  getAll,
  getById,
  update,
  deleteByOwnerId,
  deleteById,
};
