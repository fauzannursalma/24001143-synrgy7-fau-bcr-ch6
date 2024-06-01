import { Model, ModelObject } from "objection";

export class UsersModel extends Model {
  id!: string;
  name!: string;
  email!: string;
  password!: string;
  role!: string;

  protected static nameOfTable = "users";
  static get tableName(): string {
    return this.nameOfTable;
  }

  static get jsonSchema(): object {
    return {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid" },
        name: { type: "string" },
        email: { type: "string" },
        password: { type: "string" },
        role: { type: "string", enum: ["superadmin", "admin", "member"] },
      },
    };
  }

  static relationMappings = {
    carsCreated: {
      relation: Model.HasManyRelation,
      modelClass: "CarsModel",
      join: {
        from: "users.id",
        to: "cars.created_by",
      },
    },
    carsUpdated: {
      relation: Model.HasManyRelation,
      modelClass: "CarsModel",
      join: {
        from: "users.id",
        to: "cars.updated_by",
      },
    },
    carsDeleted: {
      relation: Model.HasManyRelation,
      modelClass: "CarsModel",
      join: {
        from: "users.id",
        to: "cars.deleted_by",
      },
    },
  };
}

export type Users = ModelObject<UsersModel>;
