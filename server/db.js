// db.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

const DATABASE = process.env.DATABASE;

const connectToMongo = () => {
  mongoose
    .connect(DATABASE)
    .then(() => {
      console.log(`MongoDB has been connected successfully.`);
    })
    .catch((err) => {
      console.log(`There is problem in connecting to database. ${err}`);
    });
};

export default connectToMongo;
