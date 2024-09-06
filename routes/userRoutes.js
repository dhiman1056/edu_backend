import express from 'express';
const router = express.Router();
import UserController from '../controllers/UserController.js';
import validateToken from '../middlewares/authMiddleware.js';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

//token verification middleware
router.use('/changepassword',validateToken);
router.use('/loggedInUser',validateToken);


/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       401:
 *         description: Bad request
 */

//Public routes
router.post('/register',UserController.userRegistration);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/login',UserController.userLogin);

//Protected routes
/**
 * @swagger
 * /api/user/changepassword:
 *   post:
 *     summary: Change password for the logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/changepassword',UserController.changePassword);
/**
 * @swagger
 * /api/user/loggedInUser:
 *   get:
 *     summary: Get details of the logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged in user data retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/loggedInUser',UserController.loggedInUser);


export default router;