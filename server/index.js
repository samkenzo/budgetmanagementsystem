// index.js
import express from "express";
import connectToMongo from "./db.js";
import cors from "cors";
import budgetRoutes from "./routes/budgetRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const port = process.env.PORT;
const host = process.env.HOST;

const app = express();
app.use(cors());
app.use(express.json());
connectToMongo();

app.use("/api/user", userRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/admin", adminRoutes);


app.listen(port, () => {
  console.log(
    `IITI Budget Website backend is listening at https://${host}:${port}`
  );
});
