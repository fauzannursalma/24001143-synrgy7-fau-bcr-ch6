import { Cars, CarsModel } from "../db/models/cars";

export class CarRepository {
  async list(query: any): Promise<any> {
    const { page, limit, search, sort, order, dateFilter, capacityFilter } =
      query;
    const queryBuilder = CarsModel.query()
      .where(function () {
        this.whereNull("deleted_by").orWhereRaw(
          "deleted_by = '00000000-0000-0000-0000-000000000000'"
        ); // UUID NULL
      })
      .withGraphFetched("[creator(column), updater(column), deleter(column)]")
      .modifiers({
        column: (builder) => {
          return builder.select("name", "email", "role");
        },
      });

    if ((await queryBuilder).length <= 0) {
      return [];
    }
    if (search !== undefined) {
      await queryBuilder.whereILike("plate", `%${search}%`);
    }

    if (dateFilter !== undefined) {
      await queryBuilder.where("available_at", ">=", dateFilter as string);
    }

    if (capacityFilter !== undefined) {
      await queryBuilder.where("capacity", ">=", capacityFilter as string);
    }

    if (sort !== undefined) {
      if (order === "asc" || order === "desc") {
        await queryBuilder.orderBy(sort as string, order as "asc" | "desc");
      }
    }

    if (page !== undefined && limit !== undefined) {
      await queryBuilder.page((+page - 1) * +limit, +limit);
    }

    return await queryBuilder;
  }

  async listPublic(query: any, columns: string[]): Promise<any> {
    const { page, limit, search, sort, order, dateFilter, capacityFilter } =
      query;
    const queryBuilder = CarsModel.query()
      .select(...columns)
      .where("available", true)
      .where(function () {
        this.whereNull("deleted_by").orWhereRaw(
          "deleted_by = '00000000-0000-0000-0000-000000000000'"
        ); // UUID NULL
      })
      .throwIfNotFound();

    if (search !== undefined) {
      await queryBuilder.whereILike("plate", `%${search}%`);
    }

    if (dateFilter !== undefined) {
      await queryBuilder.where("available_at", ">=", dateFilter as string);
    }

    if (capacityFilter !== undefined) {
      await queryBuilder.where("capacity", ">=", capacityFilter as string);
    }

    if (sort !== undefined) {
      if (order === "asc" || order === "desc") {
        await queryBuilder.orderBy(sort as string, order as "asc" | "desc");
      }
    }

    if (page !== undefined && limit !== undefined) {
      await queryBuilder.page((+page - 1) * +limit, +limit);
    }

    return await queryBuilder;
  }

  async listDeleted() {
    return CarsModel.query()
      .whereNotNull("deleted_at")
      .withGraphFetched("[deleter]")
      .modifyGraph("deleter", (builder) => {
        builder.select("name", "email");
      });
  }

  async show(id: string): Promise<any> {
    const car = await CarsModel.query()
      .findById(id)
      .withGraphFetched("[creator(column), updater(column), deleter(column)]")
      .modifiers({
        column: (builder) => {
          return builder.select("name", "email", "role");
        },
      })
      .throwIfNotFound();
    return car;
  }

  async showPublic(id: string, columns: string[]): Promise<any> {
    const car = await CarsModel.query()
      .findById(id)
      .select(...columns)
      .throwIfNotFound();
    return car;
  }

  async create(car: Cars, userId: string): Promise<any> {
    const cars = await CarsModel.query()
      .insert({ ...car, created_by: userId, updated_by: userId })
      .returning("*");
    return cars;
  }

  async update(id: string, car: Cars, userId: string) {
    const cars = await CarsModel.query()
      .findById(id)
      .patch({ ...car, updated_by: userId })
      .throwIfNotFound()
      .returning("*");
    return cars;
  }

  async delete(id: string, deletedBy: string) {
    // soft delete (modified deletedBy, deletedAt)
    const cars = await CarsModel.query().findById(id).patch({
      updated_by: deletedBy,
      deleted_by: deletedBy,
      deleted_at: new Date(),
    });
    return cars;
  }

  async restore(id: string) {
    return CarsModel.query().findById(id).patch({
      updated_at: new Date(),
      deleted_by: "",
    });
  }
}
