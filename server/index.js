const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./routes/utils/Swagger");

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

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

const blogRouter = require("./routes/blog");
app.use("/blog", blogRouter);

app.listen(5000, () => console.log("Server running on port 5000"));

module.exports = app;

/**
 * @swagger
 * /auth/login:
 *  post:
 *   summary: Login to the application
 *  requestBody:
 *  content:
 *   application/json:
 *   schema:
 *   type: object
 *  properties:
 *  username:
 * type: string
 * description: username
 * password:
 * type: string
 * description: password
 * responses:
 * 200:
 * description: Success
 * 201:
 * description: Invalid password
 * 404:
 * description: User not found
 */
