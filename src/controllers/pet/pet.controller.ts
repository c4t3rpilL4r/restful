import { Request, Response } from 'express';
import { Pet } from '@app/models';
import { petService } from '@app/services';

const create = async (req: Request, res: Response) => {
  try {
    const personId = +req.body.personId;
    const pet: Pet = { ...req.body };

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
    res.status(500).send({ message: 'Error fetching pet data.', error: err });
  }
};

export const petController = {
  create,
  get,
};
