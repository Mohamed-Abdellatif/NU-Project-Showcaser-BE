import { Router } from "express";
import * as commentController from "../../controllers/commentController";

const router = Router();

router.get("/comment/all-comments", commentController.getAllCommentsByAdmin);
router.get("/comment/:id", commentController.getCommentByAdmin);
router.put("/comment/:commentId", commentController.editCommentByAdmin);
router.delete("/comment/:commentId", commentController.deleteCommentByAdmin);

export default router;

