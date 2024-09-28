import express from 'express';
const router = express.Router();
import userProfileController from '../controllers/UserProfileController.js';
import validateToken from '../middlewares/authMiddleware.js';

// Apply middleware to all routes
router.use(validateToken);

router.post('/updateUserProfile',userProfileController.updateUserProfile);
router.post('/deleteAccount',userProfileController.deleteUserProfile);
router.get('/getUserProfile',userProfileController.getUserProfile);

export default router;
  
