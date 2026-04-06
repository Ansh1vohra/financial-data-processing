const express = require("express");

const recordController = require("../controllers/record.controller");
const { ROLES } = require("../constants/roles");
const { authorize, protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /api/v1/records:
 *   post:
 *     summary: Create a financial record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRecordRequest'
 *     responses:
 *       201:
 *         description: Record created successfully
 */
router.post("/", authorize(ROLES.ADMIN), recordController.createFinancialRecord);

/**
 * @swagger
 * /api/v1/records:
 *   get:
 *     summary: List financial records with filters and pagination
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
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
 *         description: Records returned successfully
 */
router.get(
  "/",
  authorize(ROLES.ADMIN, ROLES.ANALYST),
  recordController.getFinancialRecords
);

/**
 * @swagger
 * /api/v1/records/{recordId}:
 *   get:
 *     summary: Get a single financial record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recordId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record returned successfully
 */
router.get(
  "/:recordId",
  authorize(ROLES.ADMIN, ROLES.ANALYST),
  recordController.getFinancialRecord
);

/**
 * @swagger
 * /api/v1/records/{recordId}:
 *   patch:
 *     summary: Update a financial record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recordId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRecordRequest'
 *     responses:
 *       200:
 *         description: Record updated successfully
 */
router.patch(
  "/:recordId",
  authorize(ROLES.ADMIN),
  recordController.updateFinancialRecord
);

/**
 * @swagger
 * /api/v1/records/{recordId}:
 *   delete:
 *     summary: Delete a financial record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recordId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record deleted successfully
 */
router.delete(
  "/:recordId",
  authorize(ROLES.ADMIN),
  recordController.removeFinancialRecord
);

module.exports = router;
