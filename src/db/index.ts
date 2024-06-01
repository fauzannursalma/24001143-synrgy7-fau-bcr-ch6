import knex from "knex";

const knexInstance = knex({
  client: process.env.DB_CLIENT as string,
  connection: {
    host: process.env.DB_HOST as string,
    port: parseInt(process.env.DB_PORT as string),
    database: process.env.DB_NAME as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
  },
});

export default knexInstance;
