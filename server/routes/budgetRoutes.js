import express from "express";
import {
  fetchSummary,
  updateEntry,
  fetchTable,
  deleteAll,
  fetchBudget,
  fetchCompleteBudget,
} from "../controllers/budgetController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post(
  "/updateentry",
updateEntry
);

router.get(
  "/fetchtable",
  fetchTable
);


router.get("/fetchbudget", 
  authMiddleware,
  fetchBudget
);

router.get("/fetchsummary",authMiddleware, fetchSummary);
router.post("/deleteAll",authMiddleware, deleteAll);
router.get("/fetchcompletebudget",fetchCompleteBudget)

export default router;