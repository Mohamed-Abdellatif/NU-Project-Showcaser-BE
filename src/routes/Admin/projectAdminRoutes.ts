import { Router } from "express";
import * as projectController from "../../controllers/projectController";

const router = Router();

router.get("/project/all-projects", projectController.getAllProjectsByAdmin);
router.get("/project/:id", projectController.getProjectByAdmin);
router.put("/project/:projectId", projectController.editProjectByAdmin);
router.delete("/project/:projectId", projectController.deleteProjectByAdmin);

export default router;

