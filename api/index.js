
import express from "express";
const app = express();
import dotenv from "dotenv";
import getConnection from "./database.js";
import path from "path";
import cors from "cors"
const __dirname = path.resolve();
dotenv.config();

const PORT = process.env.PORT || 4000;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

getConnection();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
