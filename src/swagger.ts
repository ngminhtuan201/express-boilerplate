import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import * as express from "express";
import { config } from "./config";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express Boilerplate API",
      version: "1.0.0",
      description: "API documentation for the Express Boilerplate project",
    },
    servers: [
      {
        url: `http://localhost:${config.APP_PORT}`,
        description: "Local development server",
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
  apis: ["./src/modules/**/*.route.ts", "./src/modules/**/*.controller.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: express.Application) {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
    }),
  );
}
