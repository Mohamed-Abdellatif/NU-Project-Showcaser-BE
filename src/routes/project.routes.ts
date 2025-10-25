import { Router } from 'express';
import * as projectController from '../controllers/project.controller';
//import { validateProject } from '../middlewares/validation.middleware';

const router = Router();

router.get('/', projectController.getAllProjects);
router.post('/', projectController.createProject);

export default router;
