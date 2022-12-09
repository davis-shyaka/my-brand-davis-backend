const express = require("express");
const mongoose = require("mongoose");
const postRouter = require("./routes/postRouter");
const userRouter = require("./routes/userRouter");
const commentRouter = require("./routes/commentRouter");

// my database
require("./models/db");

// creating an instance of express
const app = express();

// middleware to be able to parse them in every single request.
app.use(express.json());

app.listen(5000, () => {
  console.log("Server has started!");
});

// register post routes
app.use("/api", postRouter);

// register user routes
app.use("/api", userRouter);

// register comment routes
app.use("/api", commentRouter);
