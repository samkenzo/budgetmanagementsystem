import User from "../models/User.js";
import { validationResult } from "express-validator";
import Consumable from "../models/Consumable.js";
import Equipment from "../models/Equipment.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  try {
    const { username, password, role, name, email } = req.body;
    console.log(`body`, req.body);
    let user = await User.findOne({ username });
    let dep = await Equipment.findOne({})
    if (user) 
      return res.status(400).json({ error: "Username already exists!" });
    

    const salt = await bcrypt.genSalt(10);
    let secPass = await bcrypt.hash(password, salt);
    user = await User.create({
      username,
      name,
      email,
      password: secPass,
      role,
    });
    if (role == 0) {
      const date = new Date();
      let year = date.getFullYear();
      if (date.getMonth() < 3) year--;
      let entry = await Consumable.create({
        username,
        department: name,
        budget: 0,
        expdenditure: 0,
        year,
        budget_changes:[],
        indents_process: [],
        direct_purchase: [],
      });
      let entry2 = await Equipment.create({
        username,
        department: name,
        budget: 0,
        expenditure: 0,
        year,
        budget_changes:[],
        indents_process: [],
        direct_purchase: [],
      });
    }
    res.json({ success: "User has been created!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Some error occured!" });
  }
};

//===============================================================================

export const updateBudget = async (req, res) => {
  try {
    const { username, type, new_amount, year,remark } = req.body;
    if (req.user.role != 2) return res.json({ error: "You are not admin!" });
    let table;
    if (type == 1) {
      table = await Equipment.findOne({ username, year });
    } else {
      table = await Consumable.findOne({ username, year });
    }
    if (!table) return res.json({ error: "Data not found!" });
    const old_amount = table.budget;
    table.budget = new_amount;
    const date=new Date();
    const date1=date.getDate();
    const date2=date.getMonth()+1;
    const date3=date.getFullYear();
    console.log("check")
    console.log(table.budget_changes)
    table.budget_changes.push(old_amount===0?`Budget Allocated: ${new_amount}. Reason: ${remark}`:` Previous Budget: ${old_amount}, Updated Budget: ${new_amount} on ${date1}/${date2}/${date3}. Reason: ${remark}`)
    // const indent = {
    //   remark: `previous budget was ${old_amount}, increased to ${new_amount} by admin`,
    // };
    // const first ={
      
    // }
    // table.indents_process.push(indent);
    // table.direct_purchase.push(indent);
    await table.save();
    return res.json({ success: "Budget Updated Succssfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Some error occured!");
  }
};

//department names, eq budg ,cons budg , usernames,

export const newyear = async (req, res) => {
  try {
    const {  curr_year } = req.body;
    const new_year=curr_year+1;
    let exist = await Consumable.find({ year: new_year });
    let tables1 = await Consumable.find({ year: curr_year });
    if(exist.length){
      return res.json({ error: `Year ${new_year}-${new_year%100+1} already added` });
    }
    if(tables1.length){
      return res.json({ error: `Year ${curr_year} has not started yet` });
    }

    //const department_list=[];
    // let dep_object={
    //   username:String,
    //   department:String,
    //   budget:Number,
    //   expenditure:{type:Number,default:0},
    //   in_process:{type:Number,default:0},
    //   year:Number
    // };


    let users = await User.find({ role: 0 });
    let usernames = [];
    for (let user of users) {
      usernames.push(user.username);
    }

    for (let table1 of tables1) {
      const username = table1.username;

      if (usernames.includes(username)) {
        await Consumable.create({
          username: table1.username,
          department: table1.department,
          budget: table1.budget,
          expenditure: 0,
          in_process: 0,
          year: new_year,
          indents_process: [],
          direct_purchase: [],
        });
      }
    }

    let tables2 = await Equipment.find({ year: curr_year });
    for (let table2 of tables2) {
      const username = table2.username;
      if (usernames.includes(username)) {
        await Equipment.create({
          username: table2.username,
          department: table2.department,
          budget: table2.budget,
          expenditure: 0,
          in_process: 0,
          year: new_year,
          indents_process: [],
          direct_purchase: [],
        });
      }
      return res.json({success:`Year ${new_year}-${new_year%100+1} added`})
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Some error occured!");
  }
};

// {
//   "new_year":2024,
//   "curr_year":2023
// }

//removing user
export const removeUser = async (req, res) => {
  const errors = validationResult(req);
  console.log(req.body)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { username } = req.body;
    if (username == req.user.username)
      return res.json({ error: "You can't remove yourself!" });
    let user = await User.findOne({ username: req.body.username });
  
    if (!user) {
      return res.status(400).json({ error: "Username not found!" });
    } else {
      await User.findOneAndDelete({ username: req.body.username });
    }
    return res.json({ success: "User has been removed!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Some error occured!" });
  }
};

//updating user
//limitation -- username is immutable (this is reasonable)
export const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  try {
    let user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).json({ error: "Username not found!" });
    } else {
      const { username, name } = req.body;
      let { role } = req.body;
      console.log(role);

      await Consumable.updateMany({ username }, { $set: { department: name } });
      await Equipment.updateMany({ username }, { $set: { department: name } });

      if (req.body.password) {
        let user = await User.findOne({ username });
        if (role != 0 && !role) role = user.role;
        console.log(role);
        await User.findOneAndDelete({ username });
        const salt = await bcrypt.genSalt(10);
        let secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
          username,
          name,
          password: secPass,
          role,
        });
      } else {
        //console.log(User.findOne({username}));
        await User.updateOne({ username }, { $set: { name: name } });
        //console.log(User.findOne({username}));
      }

      res.json({ success: "User has been updated!" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Some error occured!" });
  }
};
// {
//   "username":"Electrical",
//   "name":"Electrical change3",
//   "password":"pp"

// }