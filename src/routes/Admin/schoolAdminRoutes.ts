import { Router } from "express";
import * as schoolController from "../../controllers/schoolController";

const router = Router();

router.get("/school/all-schools", schoolController.getAllSchoolsByAdmin);
router.get("/school/:id", schoolController.getSchoolByAdmin);
router.put("/school/:schoolId", schoolController.editSchoolByAdmin);
router.delete("/school/:schoolId", schoolController.deleteSchoolByAdmin);

export default router;

