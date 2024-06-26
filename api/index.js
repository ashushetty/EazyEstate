
import express from "express";
const app = express();
import dotenv from "dotenv";
import getConnection from "./database.js";
import path from "path";
import cors from "cors"
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from 'cookie-parser';

const __dirname = path.resolve();
dotenv.config();

const PORT =  4000;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
getConnection();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/listing',listingRouter);
