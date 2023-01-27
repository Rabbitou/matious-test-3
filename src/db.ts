import { connect } from "mongoose";

export const connectDb = async () => {
  const uri = process.env.MONGO_URI ?? "mongodb://localhost:27017/supermarket";
  await connect(uri);
};
