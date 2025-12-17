import { Router } from "express";
import * as suggestionController from "../../controllers/suggestionController";

const router = Router();

router.get(
  "/suggestion/all-suggestions",
  suggestionController.getAllSuggestionsByAdmin
);
router.get("/suggestion/:id", suggestionController.getSuggestionByAdmin);
router.put(
  "/suggestion/:suggestionId",
  suggestionController.editSuggestionByAdmin
);
router.delete(
  "/suggestion/:suggestionId",
  suggestionController.deleteSuggestionByAdmin
);

export default router;

