import Equipment from "../models/equipment.js";
import Consumable from "../models/consumable.js";
import { validationResult } from "express-validator";

export const addEntry = async (req, res) => {
  try {
    const { type, indent, indent_type, year, username } = req.body;
    let table = {};
    if (type) table = await Equipment.findOne({ username, year });
    else table = await Consumable.findOne({ username, year });
    if (!table) {
      return res.status(400).json({
        error: "Dept does not exist, contact Admin to add the department",
      });
    }
    if (!indent_type) {
      table.indents_process.push(indent);
      table.expenditure += indent.amount;
    } else if (indent_type == 1) {
      table.indent_pay_done.push(indent);
      table.expenditure += indent.amount;
    } else {
      table.direct_purchase.push(indent);
      table.expenditure += indent.amount;
    }
    await table.save();
    res.json({ message: "Successful entry" });
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
          error: "Data not found",
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
          error: "Data not found",
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