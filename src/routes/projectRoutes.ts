import { Router } from 'express';
import * as projectController from '../controllers/projectController';
//import { validateProject } from '../middlewares/validation.middleware';

const router = Router();

router.get('/all', projectController.getAllProjects);
router.get('/search', projectController.searchProjects);
router.get('/featured', projectController.getFeaturedProjects);
router.get('/:id', projectController.getProjectById);
router.get('/', projectController.getProjects);
router.post('/', projectController.createProject);
router.post('/multiple', projectController.createMultipleProjects);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
export default router;
