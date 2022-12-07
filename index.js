const express = require("express");

// my database
require("./models/db");

// creating an instance of express
const app = express();

app.listen(5000, () => {
  console.log("Server has started!");
});
