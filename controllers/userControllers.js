import User from '../models/User.js'
import Equipment from '../models/equipment.js'
import Consumable from '../models/consumable.js'
import jwt from "jsonwebtoken";
import {  validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import authMiddleware from "../middlewares/authMiddleware.js";

const JWT_SECRET = "SaintMSGInsan";

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
    const data = { id: user.id };
    const authToken = jwt.sign(data, JWT_SECRET);
    res.json({ authToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Some error occured!");
  }
};

//===============================================================================

 export const login = async (req, res) => {
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
};

//======================================================================
//this is useful in creating the dept and not in adding entry

//side note-- in front end give options of equipment budget category and also array_name in both, DON'T take direct user input


export const addDept =  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      
      const { department,budget,expenditure,year,indents_process,direct_purchase,indent_pay_done } = req.body;

      let entry = await Consumable.create({
        department,budget,expenditure,year,indents_process,direct_purchase,indent_pay_done  
      });
      let entry2 = await Equipment.create({
        department,budget,expenditure,year,indents_process,direct_purchase,indent_pay_done  
      });
      res.json({message:`successfully added department ${department}`});
    } 
    catch (err) {
      console.error(err.message);
      res.status(500).send("Some error occured!");
    }
  }
  //sample request --
  // "department":"CSE",
  // "budget":9000000,
  // "expenditure":0,
  // "year":2022,
  // "indents_process":[],
  // "direct_purchase":[],
  // "indent_pay_done":[]

  //=========
  //adding entry in consumable
   //the entry also adds to the expenditure
  export const addConEntry=async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(404).json({errors:errors.array()});
    }
    try{
      const{department,array_name,array_data}=req.body;
      let table= await Consumable.findOne({department});
      if (!table) {
        return res
          .status(400)
          .json({ error: "Dept does not exist, contact Admin to add the department" });
      }
      if(array_name==="indents_process"){
        table.indents_process.push(array_data);
         table.expenditure=table.expenditure+array_data.amount;
      }
      else if(array_name==="direct_purchase"){
        table.direct_purchase.push(array_data);
         table.expenditure=table.expenditure+array_data.amount;
      }
      else if(array_name==="indent_pay_done"){
        table.indent_pay_done.push(array_data);
        table.expenditure=table.expenditure+array_data.amount;
      }
      else {
        return res
        .status(400)
        .json({ error: "wrong array name" });
      }
      await table.save()
      res.json({message:"successful entry"});


    }
    catch(err){
      console.error(err.message);
      res.status(500).send("Some error occured!");
    }}
    //sample entry
    // {
    //   "department":"CSE",
    //   "array_name":"indents_process",
    //   "array_data":{
    //    "entry_date": null,
    //       "particulars": "process",
    //       "indenter": "nano",
    //       "indent_no": 1,
    //       "po_no": 2,
    //      "indent_amount": 64528,
    //       "amount":9888,
    //       "account_head":"check check",
    //       "active": true
    //   }
    // }
    //=====================================================================================
    // export const addequipmentdept =  async (req, res) => {
    //   const errors = validationResult(req);
    //   if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    //   }
    //   try {
        
    //     const { department,budget,expenditure,year,indents_process,direct_purchase,indent_pay_done } = req.body;
  
    //     let entry = await Equipment.create({
    //       department,budget,expenditure,year,indents_process,direct_purchase,indent_pay_done  
    //     });
    //     res.json({message:`successfully added department ${department}`});
    //   } 
    //   catch (err) {
    //     console.error(err.message);
    //     res.status(500).send("Some error occured!");
    //   }
    // }
    //sample request --
  // "department":"CSE",
  // "budget":9000000,
  // "expenditure":3444440,
  // "year":2022,
  // "indents_process":[],
  // "direct_purchase":[],
  // "indent_pay_done":[]
  //=============================================================================

  //adding indent entry in equipment
  export const addEqEntry=async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(404).json({errors:errors.array()});
    }
    try{
      const{department,array_name,array_data}=req.body;
      let table= await Equipment.findOne({department});
      if (!table) {
        return res
          .status(400)
          .json({ error: "Dept does not exist, contact Admin to add the department" });
      }
      if(array_name==="indents_process"){
        table.indents_process.push(array_data);
         table.expenditure=table.expenditure+array_data.amount;
      }
      else if(array_name==="direct_purchase"){
        table.direct_purchase.push(array_data);
         table.expenditure=table.expenditure+array_data.amount;
      }
      else if(array_name==="indent_pay_done"){
        table.indent_pay_done.push(array_data);
         table.expenditure=table.expenditure+array_data.amount;
      }
      else {
        return res
        .status(400)
        .json({ error: "wrong array name" });
      }
      await table.save()
      res.json({message:"successful entry"});


    }
    catch(err){
      console.error(err.message);
      res.status(500).send("Some error occured!");
    }}
    //sample entry
    // {
    //   "department":"CSE",
    //   "array_name":"indents_process",
    //   "array_data":{
    //    "entry_date": null,
    //       "particulars": "process",
    //       "indenter": "nano",
    //       "indent_no": 1,
    //       "po_no": 2,
    //      "indent_amount": 64528,
    //       "amount":9888,
    //       "nameofparty":"check check",
    //        "category":"software",
    //       "active": true
    //   }
    // }



    //fetching budget data
    export const fetchtable = async(req,res)=>{
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        return res.status(404).json({errors:errors.array()});
      }
      try{
        const{department_name,budget_type}=req.body;
        if(budget_type=="Equipment"){
          let table= await Equipment.findOne({department:department_name});
          if (!table) {
            return res
              .status(400)
              .json({ error: "Dept does not exist, contact Admin to add the department" });
          }
          let{expenditure,year,indents_process,direct_purchase,indent_pay_done,department,budget}=table;
          return res.json({
            department:department,
            budget:budget,
            expenditure:expenditure,
            year:year,
            indents_process:indents_process,
            direct_purchase:direct_purchase,
            indent_pay_done:indent_pay_done
          })
        }
        else if(budget_type=="Consumable"){
          let table= await Consumable.findOne({department:department_name});
          if (!table) {
            return res
              .status(400)
              .json({ error: "Dept does not exist, contact Admin to add the department" });
          }
          let{expenditure,year,indents_process,direct_purchase,indent_pay_done,department,budget}=table;
          return res.json({
            department:department,
            budget:budget,
            expenditure:expenditure,
            year:year,
            indents_process:indents_process,
            direct_purchase:direct_purchase,
            indent_pay_done:indent_pay_done
          })
        }
      }
      catch(err){
        console.error(err.message);
        res.status(500).send("Some error occured!");
      }
    }


//{"department_name":"MEMS",
// "budget_type":"Equipment"
// }