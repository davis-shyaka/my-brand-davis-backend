const mongoose = require("mongoose"); // new

// Connect to MongoDB database
mongoose
  .connect("mongodb://localhost:27017/my-brand", { useNewUrlParser: true })
  .then(() => {
    console.log("my db connected");
  })
  .catch((error) => {
    console.log(error.message);
  });
