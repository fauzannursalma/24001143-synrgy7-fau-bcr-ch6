import { Model, ModelObject } from "objection";
import { UsersModel } from "./users";

export class CarsModel extends Model {
  id!: string;
  plate?: string;
  manufacture?: string;
  model?: string;
  image?: string;
  rent_per_day?: number;
  capacity?: number;
  description?: string;
  available_at?: Date;
  transmission?: string;
  available?: boolean;
  type?: string;
  year?: number;
  options?: string;
  specs?: string;
  image_public_id?: string;
  created_by!: string;
  updated_by!: string;
  deleted_by?: string;
  created_at!: Date;
  updated_at!: Date;
  deleted_at?: Date;

  static get tableName() {
    return "cars";
  }

  static get jsonSchema() {
    return {
      type: "object",

      properties: {
        id: { type: "string", format: "uuid" },
        plate: { type: "string" },
        manufacture: { type: "string" },
        model: { type: "string" },
        image: { type: "string" },
        rent_per_day: { type: "integer" },
        capacity: { type: "integer" },
        description: { type: "string" },
        available_at: { type: "string", format: "date-time" },
        transmission: { type: "string" },
        available: { type: "boolean" },
        type: { type: "string" },
        year: { type: "integer" },
        image_public_id: { type: "string" },
        created_by: { type: "string", format: "uuid" },
        updated_by: { type: "string", format: "uuid" },
      },
    };
  }

  static get relationMappings() {
    return {
      creator: {
        relation: Model.BelongsToOneRelation,
        modelClass: UsersModel,
        join: {
          from: "cars.created_by",
          to: "users.id",
        },
      },
      updater: {
        relation: Model.BelongsToOneRelation,
        modelClass: UsersModel,
        join: {
          from: "cars.updated_by",
          to: "users.id",
        },
      },
      deleter: {
        relation: Model.BelongsToOneRelation,
        modelClass: UsersModel,
        join: {
          from: "cars.deleted_by",
          to: "users.id",
        },
      },
    };
  }
}

export type Cars = ModelObject<CarsModel>;
