import express from "express";
import { login} from "../server/controllers/userController.js";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/login",
  [
    body("username", "Username should not be empty!").exists(),
    body("password", "Password should not be empty!").exists(),
  ],
  login
);


export default router;