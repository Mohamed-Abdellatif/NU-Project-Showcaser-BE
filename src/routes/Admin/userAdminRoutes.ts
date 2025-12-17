import { Router } from "express";
import * as userController from "../../controllers/userController";

const router = Router();

router.get("/user/all-users", userController.getAllUsersByAdmin);
router.get("/user/:id", userController.getUserByAdmin);
router.put("/user/:userId", userController.editUserByAdmin);
router.delete("/user/:userId", userController.deleteUserByAdmin);

export default router;

