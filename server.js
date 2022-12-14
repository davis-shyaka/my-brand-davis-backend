"use strict";

// require express and bodyParser
const express = require("express");

// our database connection
require("./config/db");

// create express app
const app = express();

// define port to run express app
const port = process.env.PORT || 3000;

// use bodyParser middleware on express app to be able to parse them in every single request.
app.use(express.json());

// Add endpoint
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Listen to server
module.exports = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Import API route
const postRouter = require("./routes/postRouter"); //importing post route
const userRouter = require("./routes/userRouter"); //importing user route
const commentRouter = require("./routes/commentRouter"); //importing comment route
const mailRouter = require("./routes/mailRouter"); //importing mail route

postRouter(app);

userRouter(app);

commentRouter(app);

mailRouter(app);
