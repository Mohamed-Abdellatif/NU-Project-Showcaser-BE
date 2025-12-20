import { Router } from "express";
import * as courseController from "../../controllers/courseController";

const router = Router();

router.get("/course/all-courses", courseController.getAllCoursesByAdmin);
router.post("/course", courseController.addCourse);
router.put("/course/:courseId", courseController.updateCourseByAdmin);
router.delete("/course/:courseId", courseController.deleteCourseByAdmin);

export default router;
