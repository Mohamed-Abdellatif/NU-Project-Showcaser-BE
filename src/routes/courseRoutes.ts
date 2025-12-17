import { Router } from 'express';
import * as coursesController from '../controllers/courseController';

const router = Router();

router.post('/', coursesController.addCourse);
router.get('/all', coursesController.getAllCourses);

export default router;
