import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import authMiddleware from "../middlewares/authMiddleware.js";

const JWT_SECRET = "SaintMSGInsan";

const router = express.Router();

router.post(
  "/createuser",
  [
    body("username", "Username should be atleast 2 characters long.").isLength({
      min: 2,
    }),
    body("name", "Name should be atleast 3 characters long. ").isLength({
      min: 5,
    }),
    body("password", "Password should be atleast 6 characters long.").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({ username: req.body.username });
      if (user) {
        return res.status(400).json({ error: "Username already exists!" });
      }

      const salt = await bcrypt.genSalt(10);
      let secPass = await bcrypt.hash(req.body.password, salt);
      const { username, name, role } = req.body;
      user = await User.create({
        username,
        name,
        password: secPass,
        role,
      });
      const data = { id: user.id };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Some error occured!");
    }
  }
);

router.post(
  "/login",
  [body("password", "Password should not be empty!").exists()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    try {
      let user = await User.findOne({ username });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials." });
      }
      const passwordCheck = await bcrypt.compare(password, user.password);
      if (!passwordCheck)
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials." });
      const { name, role } = user;
      const data = { user: { id: user.id } };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ user: { username, name, role }, authToken });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Some error occured!");
    }
  }
);

export default router;