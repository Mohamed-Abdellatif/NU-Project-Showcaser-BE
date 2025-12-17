import { Router } from 'express';
import * as coursesController from '../controllers/courseController';

const router = Router();

router.post('/', coursesController.addCourse);
router.get('/all', coursesController.getAllCourses);
router.get('/:code', coursesController.getCourseByCode);
router.delete('/:code', coursesController.deleteCourseByCode);

export default router;
