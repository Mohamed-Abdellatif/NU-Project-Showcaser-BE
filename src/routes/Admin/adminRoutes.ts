import { Router } from "express";
import projectAdminRoutes from "./projectAdminRoutes";
import userAdminRoutes from "./userAdminRoutes";
import commentAdminRoutes from "./commentAdminRoutes";
import suggestionAdminRoutes from "./suggestionAdminRoutes";
import schoolAdminRoutes from "./schoolAdminRoutes";

const router = Router();

router.use(projectAdminRoutes);
router.use(userAdminRoutes);
router.use(commentAdminRoutes);
router.use(suggestionAdminRoutes);
router.use(schoolAdminRoutes);

export default router;
