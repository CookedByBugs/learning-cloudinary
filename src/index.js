const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { connectDB } = require("./db/mongodb");
const todoRouter = require("./routes/todo.routes");
const port = process.env.PORT || 8000;

connectDB();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api", todoRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
