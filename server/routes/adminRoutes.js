import express from "express";
import { body } from "express-validator";
import {
  createUser,
  updateBudget,
  newyear,
  removeUser,
  updateUser,
} from "../controllers/adminController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post(
  "/createuser",
  [
    body("username", "Username should be atleast 2 characters long.").isLength({
      min: 2,
    }),
    body("name", "Name should be atleast 3 characters long. ").isLength({
      min: 3,
    }),
    body("password", "Password should be atleast 6 characters long.").isLength({
      min: 6,
    }),
  ],

  createUser
);

router.post("/updatebudget", authMiddleware, updateBudget);

router.post("/newYear", authMiddleware, newyear);

router.post("/removeUser", authMiddleware, removeUser);

router.post(
  "/updateUser",
  [
    body("name", "Name should be atleast 2 characters long. ").isLength({
      min: 2,
    }),
    body("password", "Password should be atleast 6 characters long.").isLength({
      min: 6,
    }),
  ],
  authMiddleware,
  updateUser
);

export default router;