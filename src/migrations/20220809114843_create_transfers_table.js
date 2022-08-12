/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('transfers', function (t) {
        t.bigIncrements('id').unsigned().primary();
        t.bigInteger('credit_id')
            .unsigned()
            .references('id')
            .inTable('transactions')
            .onDelete('set null');
        t.bigInteger('debit_id')
            .unsigned()
            .references('id')
            .inTable('transactions')
            .onDelete('set null');
        t.decimal('amount', 19, 4).notNullable();
        t.timestamps(true, true);
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable('transfers');
}
