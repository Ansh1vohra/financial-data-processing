const express = require("express");

const router = express.Router();

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Check whether the API is running
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Health status returned successfully
 */
router.get("/", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "Finance Dashboard Backend is running",
    timestamp: new Date().toISOString(),
  });
});

/**
 * @swagger
 * /api/v1/health/keep-alive:
 *   get:
 *     summary: Keep-alive ping endpoint for deployment uptime checks
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Keep-alive pong returned successfully
 */
router.get("/keep-alive", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "Keep-alive pong",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
