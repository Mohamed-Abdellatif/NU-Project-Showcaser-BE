import { Router } from "express";
import { ensureAdmin } from "../../middlewares/adminGuard";
import * as adminController from "../../controllers/adminController";
import projectAdminRoutes from "./projectAdminRoutes";
import userAdminRoutes from "./userAdminRoutes";
import commentAdminRoutes from "./commentAdminRoutes";
import suggestionAdminRoutes from "./suggestionAdminRoutes";
import schoolAdminRoutes from "./schoolAdminRoutes";
import courseAdminRoutes from "./courseAdminRoutes";

const router = Router();

// Apply admin role check to all admin routes
router.use(ensureAdmin);

// Admin dashboard stats endpoint
router.get("/stats", adminController.getAdminStats);

router.use(projectAdminRoutes);
router.use(userAdminRoutes);
router.use(commentAdminRoutes);
router.use(suggestionAdminRoutes);
router.use(schoolAdminRoutes);
router.use(courseAdminRoutes);

export default router;
