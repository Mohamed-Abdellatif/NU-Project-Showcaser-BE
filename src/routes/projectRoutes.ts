import { Router } from 'express';
import * as projectController from '../controllers/projectController';
//import { validateProject } from '../middlewares/validation.middleware';

const router = Router();

router.get('/search', projectController.searchProjects);
router.get('/', projectController.getAllProjects);
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

export default router;
