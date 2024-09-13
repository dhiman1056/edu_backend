import express from 'express';
const router = express.Router();
import userProfileController from '../controllers/UserProfileController.js';
import validateToken from '../middlewares/authMiddleware.js';

//token verification middleware
router.use('/updateUserProfile',validateToken);
router.use("/deleteUserProfile",validateToken);

router.post('/updateUserProfile',userProfileController.updateUserProfile);
router.post('/deleteUserProfile',userProfileController.deleteUserProfile);

export default router;