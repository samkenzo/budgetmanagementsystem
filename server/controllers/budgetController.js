import Equipment from "../models/Equipment.js";
import Consumable from "../models/Consumable.js";
import User from "../models/User.js";
import { validationResult } from "express-validator";

export const updateEntry = async (req, res) => {
  try {
    const { username, year, type, indent_type, indent } = req.body;

    console.log(indent);

    let table;
    if (type == 0) table = await Consumable.findOne({ username, year });
    else table = await Equipment.findOne({ username, year });
    if (!table) {
      return res.status(400).json({
        error: "Dept does not exist, contact Admin to add the department",
      });
    }
    let { indents_process, direct_purchase } = table;

    if (!indent_type) {
      const index = indents_process.findIndex(
        (item) => item.indent_no === indent.indent_no
      );
      console.log("check")
      console.log(index);
      console.log(index,indent.status)
      if(index===-1 && indent.status===2){
        return res.json({error:"Cant delete an entry without creating it"})
      }
      if (index === -1) {
        table.indents_process.push(indent);
        table.in_process += indent.indent_amount;
        table.expenditure += indent.indent_amount;
      } else {
        const { status, amount, indent_amount } = indents_process[index];
        console.log(indent, indents_process[index]);

        if (indent.status===0) {
          table.in_process += indent.indent_amount;
          if (status===0) table.in_process -= indent_amount;
          table.expenditure +=
            indent.indent_amount - (status===1 ? amount : indent_amount);
        } else if(indent.status===1) {
          // in_process -= indent_amount;
          table.expenditure +=
            indent.amount - (status===1 ? amount : indent_amount);
          if (status===0) table.in_process -= indent_amount;
        }
        else{
          if (status===0) {table.in_process -= indent_amount
          table.expenditure-=indent_amount}
          else if(status===1){ table.expenditure-=amount;}
        }
        table.indents_process[index] = indent;
      }
    } else {
      const index = direct_purchase.findIndex(
        (item) => item.indent_no === indent.indent_no
      );
      console.log(index, indent.status)
      if(index===-1 && indent.status===1){
        return res.json({error:"Cant delete an entry without creating it"})
      }
      if (index === -1) {
        console.log("haha")
        if (!indent.amount) indent.amount = indent.indent_amount;
        table.direct_purchase.push(indent);
        table.expenditure += indent.amount;
      } 
     
      
      else {
        console.log(indent.status)
        if(indent.status===0){if (!indent.amount) indent.amount = indent.indent_amount;
          console.log(direct_purchase[index].amount)
        table.expenditure += indent.amount - direct_purchase[index].amount;
        table.direct_purchase[index] = indent;
        console.log(table.direct_purchase[index]);}
        else{
          table.expenditure-=indent.amount;
          table.direct_purchase[index] = indent;
        }
      }
    }
    console.log(table.expenditure);
    const { expenditure, in_process } = table;
    await table.save();
    return res.json({ expenditure, in_process });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Some error occured!");
  }
};

//==========================================================================================
//fetching budget data
export const fetchTable = async (req, res) => {
  try {
    const { username, type, year } = req.query;
    let table;
    if (type == 1) table = await Equipment.findOne({ username, year });
    else table = await Consumable.findOne({ username, year });
    if (!table) {
      return res.status(400).json({
        error: " Data not found!",
      });
    }
    let { indents_process, direct_purchase, expenditure, in_process,budget_changes } = table;
    return res.json({
      expenditure,
      in_process,
      indents_process,
      direct_purchase,
      budget_changes
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Some error occured!");
  }
};

// {"department_name":"Department of Computer Science and Engineering",
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
        username: con.username,
        name: con.department,
        budget: con.budget,
        expenditure: con.expenditure,
        indents_process: con.indents_process,
        in_process: con.in_process,
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
        indents_process: eq.indents_process,
        in_process: eq.in_process,
      });
    }
    return res.json({ con_result, eq_result });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Some error occured!");
  }
};

export const fetchBudget = async (req, res) => {
  const { username, role } = req.user;
  const { year } = req.query;
  if (role) return res.json({ error: "You are not logged in as department!" });
  const equipment = await Equipment.findOne({ username, year });
  const consumable = await Consumable.findOne({ username, year });
  return res.json({ equipment, consumable });
};

//new addition fetching all budget for excel
export const fetchCompleteBudget = async (req, res) => {
  try{const { year} = req.query;
  const equipment = await Equipment.find({ year });
  const consumable = await Consumable.find({ year });
  return res.json({ equipment, consumable });}
  catch (err) {
    console.error(err.message);
    res.status(500).send("Some error occured!");
  }
};

//THIS WILL DELETE THE DATABASE , DONT USE

//DONT USE AT ALL

export const deleteAll = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ errors: errors.array() });
  }
  try {
    await Consumable.deleteMany({});
    await Equipment.deleteMany({});
    await User.deleteMany({ role: 0 });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Some error occured!");
  }
};

// localhost:5000/api/budget/fetchsummary?year=2023