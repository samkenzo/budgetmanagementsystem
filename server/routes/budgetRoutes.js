import express from "express";
import {
  fetchSummary,
  updateEntry,
  fetchTable,
  deleteAll,
} from "../controllers/budgetController.js";

const router = express.Router();

// router.post(
//   "/addconsumableentry",

//   addConEntry
// );
router.post(
  "/updateentry",

  updateEntry
);

router.get(
  "/fetchtable",

  fetchTable
);

router.get("/fetchsummary", fetchSummary);
router.post("/deleteAll", deleteAll);

export default router;