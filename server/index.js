const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./routes/utils/Swagger");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected!"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

const blogRouter = require("./routes/blog");
app.use("/blog", blogRouter);

app.listen(process.env.PORT, () => console.log("Server started!"));

module.exports = app;
