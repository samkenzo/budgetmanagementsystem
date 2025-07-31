import Equipment from "../models/equipment.js";
import Consumable from "../models/consumable.js";
import { validationResult } from "express-validator";

export const addConEntry = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ errors: errors.array() });
  }
  try {
    const { department, array_name, array_data } = req.body;
    let table = await Consumable.findOne({ department });
    if (!table) {
      return res.status(400).json({
        error: "Dept does not exist, contact Admin to add the department",
      });
    }
    if (array_name === "indents_process") {
      table.indents_process.push(array_data);
      table.expenditure = table.expenditure + array_data.amount;
    } else if (array_name === "direct_purchase") {
      table.direct_purchase.push(array_data);
      table.expenditure = table.expenditure + array_data.amount;
    } else if (array_name === "indent_pay_done") {
      table.indent_pay_done.push(array_data);
      table.expenditure = table.expenditure + array_data.amount;
    } else {
      return res.status(400).json({ error: "wrong array name" });
    }
    await table.save();
    res.json({ message: "successful entry" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Some error occured!");
  }
};
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
export const addEqEntry = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ errors: errors.array() });
  }
  try {
    const { department, array_name, array_data } = req.body;
    let table = await Equipment.findOne({ department });
    if (!table) {
      return res.status(400).json({
        error: "Dept does not exist, contact Admin to add the department",
      });
    }
    if (array_name === "indents_process") {
      table.indents_process.push(array_data);
      table.expenditure = table.expenditure + array_data.amount;
    } else if (array_name === "direct_purchase") {
      table.direct_purchase.push(array_data);
      table.expenditure = table.expenditure + array_data.amount;
    } else if (array_name === "indent_pay_done") {
      table.indent_pay_done.push(array_data);
      table.expenditure = table.expenditure + array_data.amount;
    } else {
      return res.status(400).json({ error: "wrong array name" });
    }
    await table.save();
    res.json({ message: "successful entry" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Some error occured!");
  }
};
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
//==========================================================================================
//fetching budget data
export const fetchTable = async (req, res) => {

  try {
    const { username, type, year } = req.query;
    if (type) {
      let table = await Equipment.findOne({ username, year });
      if (!table) {
        return res.status(400).json({
          error: "Dept does not exist, contact Admin to add the department",
        });
      }
       let { indents_process, direct_purchase, indent_pay_done } = table;
      return res.json({
        indents_process,
        direct_purchase,
        indent_pay_done,
        
      });
   } else {
      let table = await Consumable.findOne({ username, year });
      if (!table) {
        return res.status(400).json({
          error: "Dept does not exist, contact Admin to add the department",
        });
      }
      let {
        indents_process,
        direct_purchase,
        indent_pay_done,
      } = table;
      return res.json({
        indents_process,
        direct_purchase,
        indent_pay_done,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Some error occured!");
  }
};

//{"department_name":"CSE",
// "budget_type":"Equipment"
// }
//==================================================

//summary
export const fetchSummary = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ errors: errors.array() });
  }
  const year = req.query.year;
  try {
    const con_departments = await Consumable.find({ year });
    console.log(con_departments);
    const con_result = [];
    for (const con of con_departments) {
      con_result.push({
        //Indent calculation Remaining
        username: con.username,
        name: con.department,
        budget: con.budget,
        expenditure: con.expenditure,
      });
    }
    const eq_departments = await Equipment.find({ year });
    const eq_result = [];
    for (const eq of eq_departments) {
      eq_result.push({
        username: eq.username,
        name: eq.department,
        budget: eq.budget,
        expenditure: eq.expenditure,
      });
    }
    return res.json({ con_result, eq_result });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Some error occured!");
  }
};