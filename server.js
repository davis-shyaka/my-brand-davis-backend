// Import API route
import postRouter from "./routes/postRouter.js"; //importing post route
import userRouter from "./routes/userRouter.js"; //importing user route
import commentRouter from "./routes/commentRouter.js"; //importing comment route
import mailRouter from "./routes/mailRouter.js"; //importing mail route

// import express
import express from "express";

// our database connection
import db from "./config/db.js";

// instantiate the db connection function
db();

// create express app
const app = express();

// define port to run express app
const port = process.env.PORT || 3000;

// use json middleware on express app to be able to parse them in every single request.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add endpoint
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Listen to server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

postRouter(app);

userRouter(app);

commentRouter(app);

mailRouter(app);

app.use((req, res) => {
  res.status(404).json({
    message: "Route / page doesn't exist.",
  });
});

export default app;
