const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Connect to mongoose
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.DEV_MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database is connected");
  })
  .catch((err) => console.log(err.message));
