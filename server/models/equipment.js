import mongoose, { Schema } from "mongoose";

const EquipmentSchema = new Schema({
  username: String,
  department: String,
  budget: { type: Number },
  expenditure: { type: Number, default: 0 },
  in_process:{type:Number,default: 0},
  year: { type: Number, default: () => new Date().getFullYear() },
  indents_process: [
    {
      entry_date: { type: Date, default: Date.now() },
      particulars: String,
      indenter: String,
      indent_no: { type: Number },
      po_no: Number,
      indent_amount: Number,
      amount: {type: Number,default:0},
      remark: String,
      category: String,
      status: Boolean,
    },
  ],
  direct_purchase: [
    {
      entry_date: { type: Date, default: Date.now() },
      particulars: String,
      indenter: String,
      indent_no: { type: Number },
      po_no: Number,
      indent_amount: Number,
      amount: Number,
      remark: String,
      category: String,
      active: Boolean,
    },
  ],
  // indent_pay_done: [
  //   {
  //     entry_date: { type: Date, default: Date.now },
  //     particulars: String,
  //     indenter: String,
  //     indent_no: { type: Number },
  //     po_no: Number,
  //     indent_amount: Number,
  //     amount: Number,
  //     nameofparty: String,
  //     category: String,
  //     active: Boolean,
  //   },
  // ],
});

const Equipment = mongoose.model("equipment", EquipmentSchema);

export default Equipment;