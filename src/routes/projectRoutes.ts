import { Router } from 'express';
import * as projectController from '../controllers/projectController';
//import { validateProject } from '../middlewares/validation.middleware';

const router = Router();

router.get('/', projectController.getAllProjects);
router.get('/:title', projectController.getProjectByTitle);
router.get('/:major', projectController.getProjectByMajor);
router.get('/:supervisor', projectController.getProjectBySupervisor);
router.get('/:teamMember', projectController.getProjectByTeamMember);
router.get('/:teamLeader', projectController.getProjectByTeamLeader);
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

export default router;
