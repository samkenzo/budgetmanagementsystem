import express from "express";
import { forgotPasswordEmail, forgotPasswordVerify } from "../controllers/otpController.js";
const router= express.Router();

router.post("/sendotp",forgotPasswordEmail);
router.post("/resetpassword",forgotPasswordVerify);

export default router;