import express from 'express';
const router = express.Router();
import OrgController from '../controllers/OrgController.js';
import validateToken from '../middlewares/authMiddleware.js';

//token middleware
router.use('/createOrganization',validateToken);
router.use('/getOrganization',validateToken);

router.post('/createOrganization',OrgController.createOrganization);
router.get('/getOrganization',OrgController.getOrganization);
export default router;