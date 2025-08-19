import express from "express";
import { login} from "../server/controllers/userController.js";
import { body } from "express-validator";
import googleAuth from "../middlewares/googleAuth.js";

const router = express.Router();

router.post(
  "/login",
  [
    body("username", "Username should not be empty!").exists(),
    body("password", "Password should not be empty!").exists(),
  ],
  googleAuth,
  login
);

// router.post("/forgotPassword",forgotPassword)

router.get("/allUsers", allUsers);

export default router;