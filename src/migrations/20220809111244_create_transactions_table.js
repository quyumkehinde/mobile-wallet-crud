/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('transactions', function (t) {
        t.bigIncrements('id').unsigned().primary();
        t.bigInteger('user_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('cascade');
        t.decimal('amount', 19, 4).notNullable();
        t.enum('type', ['credit', 'debit']).notNullable();
        t.enum('source', ['paymentProcessor', 'transfer']).notNullable();
        t.timestamps(true, true);
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable('transactions');
}
