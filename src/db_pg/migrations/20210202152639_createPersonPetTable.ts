import * as Knex from 'knex';

const TABLE_NAME = 'person_pet';

export async function up(knex: Knex): Promise<void> {
  const tableExists = await knex.schema.hasTable(TABLE_NAME);

  if (!tableExists) {
    await knex.schema
      .createTable(TABLE_NAME, (table) => {
        table.integer('ownerId').notNullable();
        table.integer('petId').notNullable();

        table.foreign('ownerId').references('person.id');
        table.foreign('petId').references('pet.id');
      })
      .then(() => {
        // tslint:disable-next-line: no-console
        console.info(`${TABLE_NAME} created.`);
      });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(TABLE_NAME);
}
