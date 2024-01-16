const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected!"));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

const blogRouter = require("./routes/blog");
app.use("/blog", blogRouter);

app.listen(5000, () => console.log("Server running on port 5000"));
