const express = require("express");

const userController = require("../controllers/user.controller");
const { ROLES } = require("../constants/roles");
const { authorize, protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect, authorize(ROLES.ADMIN));

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: List all users
 *     description: Admin only.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User list returned successfully
 */
router.get("/", userController.getAllUsers);

/**
 * @swagger
 * /api/v1/users/{userId}:
 *   get:
 *     summary: Get a single user by id
 *     description: Admin only.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User returned successfully
 */
router.get("/:userId", userController.getUser);

/**
 * @swagger
 * /api/v1/users/{userId}:
 *   patch:
 *     summary: Update a user's name, role, or active status
 *     description: Admin only.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.patch("/:userId", userController.updateUserDetails);

module.exports = router;
