import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Binar Car Rental API",
    version: "1.0.0",
    description: "Binar Car Rental API with Swagger",
    contact: {
      name: "fauzannursalma",
    },
  },
  host: "localhost:8000",
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
    },
  },
  tags: [
    {
      name: "Auth",
      description: "Auth management",
    },
    {
      name: "Cars",
      description: "Cars management",
    },
    {
      name: "Users",
      description: "Users management",
    },
  ],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./src/routes/index.ts"];

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
  // import("./src/index");
});
