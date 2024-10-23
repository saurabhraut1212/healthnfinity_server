import express from "express";
import "dotenv/config";
import cors from "cors";

import dbConnect from "./config/dbConfig.js";
import AuthRoutes from "./routes/authRoutes.js";
import LogRoutes from "./routes/logRoutes.js"

const app = express();
dbConnect();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.send("Server started")
})


app.use("/v1/auth", AuthRoutes);
app.use("/v1", LogRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})