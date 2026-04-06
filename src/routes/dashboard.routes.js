const express = require("express");

const dashboardController = require("../controllers/dashboard.controller");
const { ROLES } = require("../constants/roles");
const { authorize, protect } = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * /api/v1/dashboard/summary:
 *   get:
 *     summary: Get dashboard summary analytics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Dashboard summary returned successfully
 */
router.get(
  "/summary",
  protect,
  authorize(ROLES.ADMIN, ROLES.ANALYST, ROLES.VIEWER),
  dashboardController.getSummary
);

module.exports = router;
