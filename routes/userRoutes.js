import express from 'express';
const router = express.Router();
import UserController from '../controllers/UserController.js';
import validateToken from '../middlewares/authMiddleware.js';

//token verification middleware
router.use('/change-password',validateToken);
router.use("/authcheck",validateToken);

//Public routes
router.post('/signup',UserController.userRegistration); // endpoint change by
router.post('/login',UserController.userLogin);

//Protected routes
router.post('/change-password',UserController.changePassword);
router.get('/authcheck',UserController.authCheck);

export default router;
