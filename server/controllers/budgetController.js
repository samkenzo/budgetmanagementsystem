import Equipment from "../models/equipment.js";
import Consumable from "../models/consumable.js";
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
      console.log(index);

      if (index === -1) {
        table.indents_process.push(indent);
        table.in_process += indent.indent_amount;
        table.expenditure += indent.indent_amount;
      } else {
        // indents_process[index] = indent;
        // table.indents_process[index].entry_date = array_data.entry_date;
        // table.indents_process[index].particulars = array_data.particulars;
        // table.indents_process[index].indenter = array_data.indenter;
        // table.indents_process[index].indent_no = array_data.indent_no;
        // table.indents_process[index].remark = array_data.remark;
        // table.indents_process[index].active = array_data.active;

        const { status, amount, indent_amount } = indents_process[index];
        console.log(indent, indents_process[index]);

        if (!indent.status) {
          table.in_process += indent.indent_amount;
          if (!status) table.in_process -= indent_amount;
          table.expenditure +=
            indent.indent_amount - (status ? amount : indent_amount);
          // const initial_indent_amount = indents_process[index].indent_amount;
          // indents_process[index].indent_amount = indent.indent_amount;

          // in_process = table.in_process - initial_indent_amount;
          // table.in_process = table.in_process + array_data.indent_amount;
          // if (array_data.amount)
          //   table.indents_process[index].amount = array_data.amount;
          // else table.indents_process[index].amount = array_data.indent_amount;
          // const initial_amount = table.indents_process.amount;
          // table.expenditure = table.expenditure - initial_amount;
          // table.expenditure = table.expenditure + array_data.amount;
        } else {
          // in_process -= indent_amount;
          table.expenditure +=
            indent.amount - (status ? amount : indent_amount);
          if (!status) table.in_process -= indent_amount;

          //set po number
          // table.indents_process[index].po_no = array_data.po_no;
          // console.log(array_data.po_no, table.indents_process[index].po_no);
          //initial indent amount
          // const initial_indent_amount=table.indents_process[index].indent_amount
          // //editiing indent amount
          // table.indents_process[index].indent_amount=array_data.indent_amount;
          // //updating in_process amount by only adding the difference
          // table.in_process=table.in_process-initial_indent_amount;
          // table.in_process=table.in_process+array_data.indent_amount;

          // if(!array_data.amount)array_data.amount=array_data.indent_amount;
          // //handling expenditure

          // table.in_process=table.in_process-array_data.indent_amount;
          // const initial_amount = table.indents_process[index].amount;
          // table.expenditure = table.expenditure - initial_amount;
          // table.indents_process[index].amount = array_data.amount;
          // table.expenditure =
          //   table.expenditure + table.indents_process[index].amount;
        }
        table.indents_process[index] = indent;
      }
    } else {
      const index = direct_purchase.findIndex(
        (item) => item.indent_no === indent.indent_no
      );
      if (index === -1) {
        table.direct_purchase.push(indent);
        table.expenditure += indent.amount;
      } else {
        table.expenditure += indent.amount - direct_purchase[index].amount;
        table.direct_purchase[index] = indent;
        // const init_amt = table.direct_purchase[index].amount;
        // table.direct_purchase[index].entry_date = array_data.entry_date;
        // table.direct_purchase[index].particulars = array_data.particulars;
        // table.direct_purchase[index].indenter = array_data.indenter;
        // table.direct_purchase[index].indent_no = array_data.indent_no;
        // table.direct_purchase[index].indent_amount = array_data.indent_amount;
        // table.direct_purchase[index].amount = array_data.amount;
        // table.direct_purchase[index].remark = array_data.remark;
        // table.direct_purchase[index].active = array_data.active;
        // table.expenditure = table.expenditure - init_amt;
        // table.expenditure = table.expenditure + array_data.amount;
      }
    }
    // else if (array_name === "indent_pay_done") {
    //   table.indent_pay_done.push(array_data);
    //   table.expenditure = table.expenditure + array_data.amount;
    // }
    // else {
    //   return res.status(400).json({ error: "wrong array name" });
    // }
    console.log(table.expenditure);
    const { expenditure, in_process } = table;
    await table.save();
    return res.json({ expenditure, in_process });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Some error occured!");
  }
};
// {
//   "department":"Department of Computer Science and Engineering",
//   "array_name":"indents_process",
//   "array_data":{
//     "entry_date": null,
//       "particulars": "process",
//       "indenter": "nano",
//       "indent_no": 1,
//       "po_no": null,
//       "indent_amount": 64528,
//       "amount":null,
//       "nameofparty":"check check",
//         "category":"software",
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

//     const { department,budget,expenditure,year,indents_process,direct_purchase[index],indent_pay_done } = req.body;

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
// export const addEqEntry = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(404).json({ errors: errors.array() });
//   }
//   try {
//     const { username, array_name, array_data } = req.body;
//     let table = await Equipment.findOne({ username });
//     if (!table) {
//       return res.status(400).json({
//         error: "Dept does not exist, contact Admin to add the department",
//       });
//     }
//     if (array_name === "indents_process") {
//       const index = table.indents_process.findIndex(
//         (item) => item.indent_no === array_data.indent_no
//       );
//       console.log(index);
//       if (index === -1) {
//         array_data.amount = array_data.indent_amount;
//         table.indents_process.push(array_data);
//         table.in_process = table.in_process + array_data.indent_amount;

//         table.expenditure = table.expenditure + array_data.amount;
//       } else {
//         table.indents_process[index].entry_date = array_data.entry_date;
//         table.indents_process[index].particulars = array_data.particulars;
//         table.indents_process[index].indenter = array_data.indenter;
//         table.indents_process[index].indent_no = array_data.indent_no;
//         table.indents_process[index].remark = array_data.remark;
//         table.indents_process[index].category = array_data.category;
//         table.indents_process[index].active = array_data.active;

//         if (!array_data.po_no) {
//           const initial_indent_amount =
//             table.indents_process[index].indent_amount;
//           table.indents_process[index].indent_amount = array_data.indent_amount;
//           table.in_process = table.in_process - initial_indent_amount;
//           table.in_process = table.in_process + array_data.indent_amount;
//           if (array_data.amount)
//             table.indents_process[index].amount = array_data.amount;
//           else table.indents_process[index].amount = array_data.indent_amount;
//           const initial_amount = table.indents_process.amount;
//           table.expenditure = table.expenditure - initial_amount;
//           table.expenditure = table.expenditure + array_data.amount;
//         } else {
//           //set po number
//           table.indents_process[index].po_no = array_data.po_no;
//           console.log(array_data.po_no, table.indents_process[index].po_no);
//           //initial indent amount
//           // const initial_indent_amount=table.indents_process[index].indent_amount
//           // //editiing indent amount
//           // table.indents_process[index].indent_amount=array_data.indent_amount;
//           // //updating in_process amount by only adding the difference
//           // table.in_process=table.in_process-initial_indent_amount;
//           // table.in_process=table.in_process+array_data.indent_amount;

//           // if(!array_data.amount)array_data.amount=array_data.indent_amount;
//           // //handling expenditure

//           // table.in_process=table.in_process-array_data.indent_amount;
//           const initial_amount = table.indents_process[index].amount;
//           table.expenditure = table.expenditure - initial_amount;
//           table.indents_process[index].amount = array_data.amount;
//           table.expenditure =
//             table.expenditure + table.indents_process[index].amount;
//         }
//       }
//     } else if (array_name === "direct_purchase") {
//       const index = table.direct_purchase.findIndex(
//         (item) => item.indent_no === array_data.indent_no
//       );
//       if (index === -1) {
//         table.direct_purchase.push(array_data);
//         table.expenditure = table.expenditure + array_data.amount;
//       } else {
//         const init_amt = table.direct_purchase[index].amount;
//         table.direct_purchase[index].entry_date = array_data.entry_date;
//         table.direct_purchase[index].particulars = array_data.particulars;
//         table.direct_purchase[index].indenter = array_data.indenter;
//         table.direct_purchase[index].indent_no = array_data.indent_no;
//         table.direct_purchase[index].indent_amount = array_data.indent_amount;
//         table.direct_purchase[index].amount = array_data.amount;
//         table.direct_purchase[index].remark = array_data.remark;
//         table.direct_purchase[index].category = array_data.category;
//         table.direct_purchase[index].active = array_data.active;
//         table.expenditure = table.expenditure - init_amt;
//         table.expenditure = table.expenditure + array_data.amount;
//       }
//     }
//     // else if (array_name === "indent_pay_done") {
//     //   table.indent_pay_done.push(array_data);
//     //   table.expenditure = table.expenditure + array_data.amount;
//     // }
//     else {
//       return res.status(400).json({ error: "wrong array name" });
//     }
//     await table.save();
//     res.json({ message: "successful entry" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Some error occured!");
//   }
// };
//sample entry
// {
//   "department":"CSE",
//   "array_name":"indents_process",
//   "array_data":{
//    "entry_date": null,
//       "particulars": "process",
//       "indenter": "nano",
//       "indent_no": 1,
//       "po_no": ,
//      "indent_amount": 64528,
//       "amount":,
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
    console.log(username, year, type);
    let table;
    if (type == 1) table = await Equipment.findOne({ username, year });
    else table = await Consumable.findOne({ username, year });
    if (!table) {
      return res.status(400).json({
        error: " Data not found!",
      });
    }
    let { indents_process, direct_purchase } = table;
    return res.json({
      indents_process,
      direct_purchase,
    });
    // return res.json({
    //   department: department,
    //   budget: budget,
    //   expenditure: expenditure,
    //   year: year,
    //   indents_process: indents_process,
    //   direct_purchase: direct_purchase,
    //   // indent_pay_done: indent_pay_done,
    // });
    // }
    // else {
    //   let table = await Consumable.findOne({ username, year });
    //   if (!table) {
    //     return res.status(400).json({
    //       error: " Data not found!",
    //     });
    //   }
    //   let { indents_process, direct_purchase } = table;
    //   return res.json({
    //     indents_process,
    //     direct_purchase,
    //   });
    // return res.json({
    //   department: department,
    //   budget: budget,
    //   expenditure: expenditure,
    //   year: year,
    //   indents_process: indents_process,
    //   direct_purchase: direct_purchase,
    //   // indent_pay_done: indent_pay_done,
    // });
    // }
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
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(404).json({ errors: errors.array() });
  // }
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

// localhost:5050/api/budget/fetchsummary?year=2023