import { Router } from 'express';
import * as projectController from '../controllers/projectController';
import { ensureAuthenticated } from '../middlewares/authGuard';
//import { validateProject } from '../middlewares/validation.middleware';

const router = Router();

router.get('/all', projectController.getAllProjects);
router.get('/search', projectController.searchProjects);
router.get('/featured', projectController.getFeaturedProjects);
router.get('/starred', ensureAuthenticated, projectController.getStarredProjects);
router.get('/pending-by-ta/:taMail', ensureAuthenticated, projectController.getPendingProjectsByTA);
router.get('/:id', projectController.getProjectById);
router.get('/', projectController.getProjects);
router.post('/', ensureAuthenticated, projectController.createProject);
router.post('/multiple', projectController.createMultipleProjects);
router.put('/:id', projectController.updateProject);
router.put('/star/:id', ensureAuthenticated, projectController.updateProjectStars);
router.delete('/:id', projectController.deleteProject);

export default router;
