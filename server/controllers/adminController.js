import User from "../models/User.js";
import { validationResult } from "express-validator";
import Consumable from "../models/consumable.js";
import Equipment from "../models/equipment.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
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
    res.json({ success: "User has been created!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Some error occured!" });
  }
};

//===============================================================================

export const addDept = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { username, name, password, budget, expenditure, in_process,year } = req.body;
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ error: "Username already exists!" });
    }
    let entry = await Consumable.create({
      username,
      department: name,
      budget,
      expenditure,
      in_process,
      year,
      indents_process: [],
      direct_purchase: [],
      // indent_pay_done: [],
    });
    let entry2 = await Equipment.create({
      username,
      department: name,
      budget,
      expenditure,
      in_process,
      year,
      indents_process: [],
      direct_purchase: [],
      // indent_pay_done: [],
    });
    const salt = await bcrypt.genSalt(10);
    let secPass = await bcrypt.hash(password, salt);
    const role = 0;
    user = await User.create({
      username,
      name,
      password: secPass,
      role,
    });
    res.json({ success: "Department has been created!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Some error occured!");
  }
};


//{     "username":"mems2",
// "password":"password",
// "name":"MM 310",
// "budget":9000000,
// "expenditure":3444440,
// "in_process":0,
// "year":2025
// }