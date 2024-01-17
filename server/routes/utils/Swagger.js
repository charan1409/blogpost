const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog Post API",
      version: "1.0.0",
      description: "API for Blog Post",
    },
    servers: [
      {
        url: "https://blogpostbackend.onrender.com",
      },
    ],
  },
  apis: ["./routes/**/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
