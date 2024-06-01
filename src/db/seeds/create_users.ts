import { Knex } from "knex";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Generate dummy data for members
      const members = Array.from({ length: 15 }, (_, index) => {
        return {
          id: uuidv4(), // Generate UUID for ID
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: bcrypt.hashSync("password", 10), // Hash password using bcrypt
          role: "member",
        };
      });

      // Generate dummy data for admins
      const admins = Array.from({ length: 5 }, (_, index) => {
        return {
          id: uuidv4(), // Generate UUID for ID
          name: `Admin ${index + 1}`,
          email: `admin${index + 1}@mail.com`,
          password: bcrypt.hashSync("password", 10), // Hash password using bcrypt
          role: "admin",
        };
      });

      // Generate dummy data for superadmins
      const superadmins = [
        {
          id: "a3c4e7a2-dc6c-4a82-91d6-eb0c38d7866e",
          name: "Fauzan Nursalma",
          email: "fauzann@mail.com",
          password: bcrypt.hashSync("password", 10), // Hash password using bcrypt
          role: "superadmin",
        },
        {
          id: "bcfe0496-3fb1-4dc2-ae69-65f3c45cf7b0",
          name: "Superadmin 2",
          email: "superadmin2@mail.com",
          password: bcrypt.hashSync("password", 10), // Hash password using bcrypt
          role: "superadmin",
        },
        {
          id: "ed17b8f1-cd84-49c7-8b76-22418cf5467b",
          name: "Superadmin 3",
          email: "superadmin3@mail.com",
          password: bcrypt.hashSync("password", 10), // Hash password using bcrypt
          role: "superadmin",
        },
      ];

      // Combine all users
      const allUsers = [...superadmins, ...admins, ...members];

      return knex("users").insert(allUsers);
    });
}
