import 'tsconfig-paths/register';
import knex from './src/db_pg/knex-config';
import express from 'express';
import querystring from 'querystring';
import { initRoutes } from './src/routes/index';

const app = express();
const port = 3000;

const startApp = async () => {
  await Promise.all([
    (async () => {
      try {
        await knex.raw('select 1+1 as result');
        // tslint:disable-next-line: no-console
        console.info('[OK] PG DB');
        return;
      } catch (err) {
        // tslint:disable-next-line: no-console
        console.error('[FAIL] PG DB');
        // tslint:disable-next-line: no-console
        console.error(err);
        return Promise.reject(err);
      }
    })(),
  ]);

  app.use(express.json());

  initRoutes(app);

  app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.info(`Server is up at port ${port}.`);
  });
};

startApp();
