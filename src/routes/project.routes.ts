import { Router } from 'express';
import * as projectController from '../controllers/project.controller';
//import { validateProject } from '../middlewares/validation.middleware';
import { ensureAuthenticated } from '../middlewares/authGuard';

const router = Router();

router.get('/', ensureAuthenticated, projectController.getAllProjects);
router.post('/', projectController.createProject);

export default router;
