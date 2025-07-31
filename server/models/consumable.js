import mongoose, { Schema } from "mongoose";

const ConsumableSchema = new Schema({
  username: String,
  department: String,
  budget: Number,
  expenditure: { type: Number, default: 0 },
  year: { type: Date, default: () => new Date().getFullYear() },
  indents_process: [
    {
      entry_date: { type: Date, default: Date.now },
      particulars: String,
      indenter: String,
      indent_no: { type: Number },
      po_no: Number,
      indent_amount: Number,
      amount: Number,
      account_head: Number,
    },
  ],
  direct_purchase: [
    {
      entry_date: { type: Date, default: Date.now },
      particulars: String,
      indenter: String,
      indent_no: { type: Number },
      po_no: Number,
      indent_amount: Number,
      amount: Number,
      account_head: String,
      active: Boolean,
    },
  ],
  indent_pay_done: [
    {
      entry_date: { type: Date, default: Date.now },
      particulars: String,
      indenter: String,
      indent_no: { type: Number },
      po_no: Number,
      indent_amount: Number,
      amount: Number,
      account_head: String,
      active: Boolean,
    },
  ],
});

const Consumable = mongoose.model("consumable", ConsumableSchema);

export default Consumable;