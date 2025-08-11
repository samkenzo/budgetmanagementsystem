import mongoose, { Schema } from "mongoose";

const ConsumableSchema = new Schema({
  username: String,
  department: String,
  budget: Number,
  expenditure: { type: Number, default: 0 },
  in_process: { type: Number, default: 0 },
  year: { type: Number, default: () => new Date().getFullYear() },
  indents_process: [
    {
      entry_date: { type: Date, default: Date.now() },
      particulars: String,
      indenter: String,
      indent_no: { type: Number },
      po_no: Number,
      indent_amount: Number,
      amount: { type: Number, default: 0 },
      remark: String,
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
    },
  ],
});

const Consumable = mongoose.model("consumable", ConsumableSchema);

export default Consumable;