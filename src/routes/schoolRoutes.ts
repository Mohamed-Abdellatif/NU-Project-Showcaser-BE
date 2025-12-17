import { Router } from 'express';
import * as schoolController from '../controllers/schoolController';

const router = Router();


router.get('/all', schoolController.getAllSchools);

export default router;