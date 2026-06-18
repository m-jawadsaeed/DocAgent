import swaggerJsDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsDoc({
  definition: {
    openapi: "3.0.0",

    info: {
      title: "AI Document Assistant API",

      version: "1.0.0",

      description: "Production AI Engineering Project",
    },

    servers: [
      {
        url: "http://localhost:5000/api",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./src/routes/*.ts"],
});
