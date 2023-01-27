import fs from "fs";
import { parse } from "csv-parse";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { connectDb } from "./db";
import mongoose from "mongoose";
import { Sales } from "./models/Sales";
import { ISales } from "./types/ISales";
import csv from "csvtojson";
import dotenv from "dotenv";
import { path } from "app-root-path";

dotenv.config();
const file = process.argv[2] || process.env.FILE;
const filepath = path + "/" + file;

const csvArray: ISales[] = [];

const app = express();
const port = process.env.port || 4000;
app.use(cors());
app.use(bodyParser.json());

mongoose.set("strictQuery", false);
try {
  connectDb();
  app.listen(port, () => {
    console.log(`server running on ${port}`);
  });

  csv()
    .fromFile(filepath)
    .on("data", (jsonObj) => {
      const parsedData = JSON.parse(jsonObj.toString("utf-8"));

      csvArray.push({
        invoiceID: parsedData["Invoice ID"],
        branch: parsedData["Branch"],
        city: parsedData["City"],
        customerType: parsedData["Customer type"],
        gender: parsedData["Gender"],
        productLine: parsedData["Product line"],
        unitPrice: parsedData["Unit price"],
        quantity: parsedData["Quantity"],
        tax_5per: parsedData["Tax 5%"],
        total: parsedData["Total"],
        date: parsedData["Date"],
        time: parsedData["Time"],
        payment: parsedData["Payment"],
        cogs: parsedData["cogs"],
        gross_margin_per: parsedData["gross margin percentage"],
        gross_income: parsedData["gross income"],
        rating: parsedData["Rating"],
      });
    })
    .on("done", (error) => {
      if (error) {
        return console.log("done error", error);
      }
      Sales.create(csvArray).catch((err) => {
        console.log(err.message);
      });
    });
} catch (error) {
  console.log(error);
}

app.get("/sales", async (req: Request, res: Response) => {
  const data = await Sales.aggregate().sortByCount("productLine");
  res.status(200).json(data);
});

app.get("/gender/rating", async (req: Request, res: Response) => {
  const data = await Sales.aggregate([
    { $group: { _id: "$gender", rating: { $avg: "$rating" } } },
  ]);
  res.status(200).json(data);
});

app.get("/gender/type", async (req: Request, res: Response) => {
  const data = await Sales.aggregate([
    {
      $group: {
        _id: ["$gender", "$customerType"],
        count: { $sum: 1 },
      },
    },
  ]);
  res.status(200).json(data);
});

export default app;
