import express from "express";
import { fetchSummary, addEntry, fetchTable } from "../controllers/budgetController.js";

const router = express.Router();

  router.post(
     "/addentry",
   addEntry
  );
  
  router.get(
    "/fetchtable",
  
    fetchTable
  );

  router.get(
    "/fetchsummary",
    fetchSummary
  )

export default router;