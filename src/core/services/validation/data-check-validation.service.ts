import { Response } from 'express';
import knex from '../../../db_pg/knex-config';

const checkDataIfExisting = async (
  tableName: string,
  condition: Record<string, string>,
  res: Response,
  messageIfNotExisting: string,
) => {
  const data = await knex(tableName).where(condition);

  if (!data.length) {
    res.status(404);
    res.send({ message: messageIfNotExisting });
  }

  return data.length ? true : false;
};

export const validationService = { checkDataIfExisting };
