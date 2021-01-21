import { Request, Response } from 'express';
import { Animal, Pet } from '@app/models';
import { animalService, personService, petService } from '@app/services';

const create = async (req: Request, res: Response) => {
  try {
    const personId = +req.body.personId;
    const person = await personService.getById(personId);

    if (!person.length) {
      res.status(404).send({ message: 'Person not found.' });
      return;
    }

    const animalType = req.body.type;
    let animal = await animalService.getByType(animalType);

    if (!animal.length) {
      const newAnimalDetails: Animal = {
        type: animalType,
      };

      animal = await animalService.create(newAnimalDetails);
    }

    const pet: Pet = {
      name: req.body.name,
      animalId: animal[0].id,
    };

    const newPet = await petService.create(personId, pet);

    res.status(200).send(newPet);
  } catch (err) {
    res.status(500).send({ message: 'Error creating pet data.', error: err });
  }
};

const get = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? +req.query.page : 0;
    const limit = req.query.limit ? +req.query.limit : 0;

    const pets = await petService.get(page, limit);

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

const update = async (req: Request, res: Response) => {
  try {
    const petId = +req.params.petId;
    const pet = await petService.getById(petId);

    if (!pet.length) {
      res.status(404).send({ message: 'Pet not found.' });
      return;
    }

    const updatedPetDetails: Pet = { ...req.body };

    const updatedPet = await petService.update(updatedPetDetails);

    res.status(200).send(updatedPet);
  } catch (err) {
    res.status(500).send({
      message: 'Error updating pet data.',
      error: err,
    });
  }
};

export const petController = {
  create,
  get,
  getById,
  update,
};
