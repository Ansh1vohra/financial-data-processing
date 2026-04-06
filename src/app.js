const express = require("express");
const cookieParser = require("cookie-parser");

const swaggerSpec = require("./docs/swagger");
const { errorHandler } = require("./middlewares/error.middleware");
const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const healthRoutes = require("./routes/health.routes");
const recordRoutes = require("./routes/record.routes");
const userRoutes = require("./routes/user.routes");
const { swaggerGenerateHtml, swaggerServeFiles } = require("./utils/swagger");

const app = express();
const swaggerHtml = swaggerGenerateHtml(swaggerSpec);
console.log("Loaded app.js build: swagger-debug-2026-04-06");

app.use(express.json());
app.use(cookieParser());

app.use("/api-docs", swaggerServeFiles(swaggerSpec));
app.use("/api-docs", (request, response, next) => {
  if (
    request.path === "/" ||
    request.path === "" ||
    request.originalUrl === "/api-docs" ||
    request.originalUrl === "/api-docs/"
  ) {
    return response.status(200).send(swaggerHtml);
  }

  return next();
});
app.get("/codex-check-123", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "Current app.js is loaded",
  });
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/records", recordRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/health", healthRoutes);

app.use((request, response) => {
  response.status(404).json({
    success: false,
    message: `Route not found: ${request.method} ${request.originalUrl}`,
  });
});

app.use(errorHandler);

module.exports = app;
