import { Router } from "express";
import { ensureAdmin } from "../../middlewares/adminGuard";
import projectAdminRoutes from "./projectAdminRoutes";
import userAdminRoutes from "./userAdminRoutes";
import commentAdminRoutes from "./commentAdminRoutes";
import suggestionAdminRoutes from "./suggestionAdminRoutes";
import schoolAdminRoutes from "./schoolAdminRoutes";

const router = Router();

// Apply admin role check to all admin routes
router.use(ensureAdmin);

router.use(projectAdminRoutes);
router.use(userAdminRoutes);
router.use(commentAdminRoutes);
router.use(suggestionAdminRoutes);
router.use(schoolAdminRoutes);

export default router;
