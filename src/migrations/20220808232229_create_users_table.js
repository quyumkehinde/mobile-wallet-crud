/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('users', function (t) {
        t.bigIncrements('id').unsigned().primary();
        t.string('email').unique().notNullable();
        t.string('password').notNullable();
        t.decimal('account_balance', 19, 4)
            .unsigned()
            .notNullable()
            .defaultTo(0);
        t.timestamps(true, true);
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable('users');
}
