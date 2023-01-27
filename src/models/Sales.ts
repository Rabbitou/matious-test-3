import { Schema, model } from "mongoose";
import { ISales } from "../types/ISales";

const salesSchema = new Schema<ISales>(
  {
    invoiceID: {
      type: String,
      required: true,
      unique: true,
    },
    branch: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    customerType: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    productLine: {
      type: String,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    tax_5per: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
      validate: {
        validator: function (t: any) {
          return /^((0?[13578]|10|12)(-|\/)(([1-9])|(0[1-9])|([12])([0-9]?)|(3[01]?))(-|\/)((19)([2-9])(\d{1})|(20)([01])(\d{1})|([8901])(\d{1}))|(0?[2469]|11)(-|\/)(([1-9])|(0[1-9])|([12])([0-9]?)|(3[0]?))(-|\/)((19)([2-9])(\d{1})|(20)([01])(\d{1})|([8901])(\d{1})))$/.test(
            t
          );
        },
        message: (props) => `${props.value} is not a valid date!`,
      },
    },
    time: {
      type: String,
      required: true,
      validate: {
        validator: function (t: any) {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(t);
        },
        message: (props) => `${props.value} is not a valid time!`,
      },
    },
    payment: {
      type: String,
      required: true,
    },
    cogs: {
      type: Number,
      required: true,
    },
    gross_margin_per: {
      type: Number,
      required: true,
    },
    gross_income: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
  },
  { collection: "sales" }
);

export const Sales = model<ISales>("sales", salesSchema);
