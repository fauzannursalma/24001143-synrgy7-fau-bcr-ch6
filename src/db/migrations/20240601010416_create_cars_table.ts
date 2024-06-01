import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("cars", (table) => {
    table.uuid("id").primary().notNullable();
    table.string("plate");
    table.string("manufacture");
    table.string("model");
    table.text("image");
    table.integer("rent_per_day");
    table.integer("capacity");
    table.text("description");
    table.timestamp("available_at");
    table.string("transmission");
    table.boolean("available");
    table.string("type");
    table.integer("year");
    table.specificType("options", "text[]");
    table.specificType("specs", "text[]");
    table.string("image_public_id").nullable();
    table.uuid("created_by");
    table.foreign("created_by").references("id").inTable("users");
    table.uuid("updated_by");
    table.foreign("updated_by").references("id").inTable("users");
    table.uuid("deleted_by").nullable();
    table.foreign("deleted_by").references("id").inTable("users");
    table.timestamps(true, true);
    table.timestamp("deleted_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("cars");
}
