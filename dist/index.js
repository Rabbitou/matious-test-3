"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const mongoose_1 = __importDefault(require("mongoose"));
const Sales_1 = require("./models/Sales");
const csvtojson_1 = __importDefault(require("csvtojson"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_root_path_1 = require("app-root-path");
dotenv_1.default.config();
const file = process.argv[2] || process.env.FILE;
const filepath = app_root_path_1.path + "/" + file;
const csvArray = [];
const app = (0, express_1.default)();
const port = process.env.port || 4000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
mongoose_1.default.set("strictQuery", false);
try {
    (0, db_1.connectDb)();
    app.listen(port, () => {
        console.log(`server running on ${port}`);
    });
    (0, csvtojson_1.default)()
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
        Sales_1.Sales.create(csvArray).catch((err) => {
            console.log(err.message);
        });
    });
}
catch (error) {
    console.log(error);
}
app.get("/sales", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield Sales_1.Sales.aggregate().sortByCount("productLine");
    res.status(200).json(data);
}));
app.get("/gender/rating", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield Sales_1.Sales.aggregate([
        { $group: { _id: "$gender", rating: { $avg: "$rating" } } },
    ]);
    res.status(200).json(data);
}));
app.get("/gender/type", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield Sales_1.Sales.aggregate([
        {
            $group: {
                _id: ["$gender", "$customerType"],
                count: { $sum: 1 },
            },
        },
    ]);
    res.status(200).json(data);
}));
exports.default = app;
