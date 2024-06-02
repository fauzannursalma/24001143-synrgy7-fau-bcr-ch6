import { CarRepository } from "../repositories/carRepository";
import { Cars } from "../db/models/cars";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "../utils/cloudinaryImageUtils";
import { carsPublic } from "../utils/dataColumnUtils";
import { up } from "../db/migrations/20240601010404_create_users_table";
import { randomUUID } from "crypto";
import { el } from "@faker-js/faker";

export class CarService {
  private carRepository: CarRepository;

  constructor() {
    this.carRepository = new CarRepository();
  }

  async list(query: any) {
    return this.carRepository.list(query);
  }

  async listPublic(query: any) {
    return this.carRepository.listPublic(query, carsPublic);
  }

  async show(id: any) {
    const car = await this.carRepository.show(id);
    return car;
  }

  async showPublic(id: string) {
    const car = await this.carRepository.showPublic(id, carsPublic);
    return car;
  }

  async create(car: any, image: any, userId: string) {
    let carPayload;

    if (image) {
      const result = await uploadImageToCloudinary(image, "cars");
      carPayload = {
        id: randomUUID(),
        ...car,
        image_public_id: result.public_id,
        image: result.secure_url,
      };
    } else {
      carPayload = {
        ...car,
        image_public_id: "",
        image: "",
      };
    }

    const newCar = await this.carRepository.create(carPayload as Cars, userId);
    return newCar;
  }

  async update(id: string, car: any, image: any, userId: string): Promise<any> {
    const carInDB = await this.carRepository.show(id);

    if (!image || !image.buffer) {
      const carPayload = { ...car };
      return await this.carRepository.update(id, carPayload as Cars, userId);
    }

    if (carInDB.image == null && carInDB.image_public_id == null) {
      const result = await uploadImageToCloudinary(image, "cars");

      const carPayload = {
        ...car,
        image_public_id: result.public_id,
        image: result.secure_url,
      };

      return await this.carRepository.update(id, carPayload as Cars, userId);
    }

    await deleteImageFromCloudinary(carInDB.image_public_id as string);

    const result = await uploadImageToCloudinary(image, "cars");

    const carPayload = {
      ...car,
      image_public_id: result.public_id,
      image: result.secure_url,
    };

    return await this.carRepository.update(id, carPayload as Cars, userId);
  }

  async delete(id: string, userId: string) {
    const carInDB = await this.carRepository.show(id);

    if (!carInDB) {
      throw new Error("Car not found");
    } else if (carInDB.deleted_at != null) {
      throw new Error("Car already deleted");
    }

    if (carInDB.image != null && carInDB.image_public_id != null) {
      await deleteImageFromCloudinary(carInDB.image_public_id as string);

      return await this.carRepository.delete(id, userId);
    }
    return await this.carRepository.delete(id, userId);
  }

  async restore(id: string) {
    return this.carRepository.restore(id);
  }

  async trash() {
    const cars = await this.carRepository.trash();
    return cars;
  }
}

export const carService = new CarService();
