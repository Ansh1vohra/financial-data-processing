const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Finance Dashboard Backend API",
      version: "1.0.0",
      description:
        "Backend APIs for authentication, user management, financial records, and dashboard analytics.",
    },
    servers: [
      {
        url: "http://localhost:5000",
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
      schemas: {
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "Ansh Vohra" },
            email: { type: "string", example: "ansh@example.com" },
            password: { type: "string", example: "strongpass123" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "ansh@example.com" },
            password: { type: "string", example: "strongpass123" },
          },
        },
        RefreshTokenRequest: {
          type: "object",
          properties: {
            refreshToken: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
            },
          },
        },
        UpdateUserRequest: {
          type: "object",
          properties: {
            name: { type: "string", example: "Updated User" },
            role: { type: "string", enum: ["admin", "analyst", "viewer"] },
            isActive: { type: "boolean", example: true },
          },
        },
        CreateRecordRequest: {
          type: "object",
          required: ["amount", "type", "category", "date"],
          properties: {
            amount: { type: "number", example: 4500 },
            type: { type: "string", enum: ["income", "expense"] },
            category: { type: "string", example: "Salary" },
            date: { type: "string", format: "date", example: "2026-04-06" },
            description: { type: "string", example: "Monthly salary credit" },
          },
        },
        UpdateRecordRequest: {
          type: "object",
          properties: {
            amount: { type: "number", example: 2500 },
            type: { type: "string", enum: ["income", "expense"] },
            category: { type: "string", example: "Rent" },
            date: { type: "string", format: "date", example: "2026-04-06" },
            description: { type: "string", example: "Updated transaction note" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJSDoc(options);
