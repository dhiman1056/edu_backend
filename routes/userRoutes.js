import express from 'express';
const router = express.Router();
import UserController from '../controllers/UserController.js';
import validateToken from '../middlewares/authMiddleware.js';

//token verification middleware
router.use('/changepassword',validateToken);
router.use('/loggedInUser',validateToken);


//Public routes
router.post('/signup',UserController.userRegistration); // endpoint change by
router.post('/login',UserController.userLogin);

//Protected routes
router.post('/changepassword',UserController.changePassword);
router.get('/loggedInUser',UserController.loggedInUser);

export default router;
