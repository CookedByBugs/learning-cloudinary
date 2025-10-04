const express = require("express");
const todoRouter = express.Router();
const multer = require("multer");
const fs = require("fs");
const upload = multer({ dest: "uploads/" });
const { upload: cloudUpload } = require("../utils/cloudinary");
const Todo = require("../models/todos.model");
todoRouter.post("/create", upload.array("images"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const uploadResults = await Promise.all(
      req.files.map((file) =>
        cloudUpload(file.path, { folder: "todo" })
          .then((result) => {
            console.log("result", result);
            return result.secure_url;
          })
          .catch((error) => console.log(error))
          .finally(() => {
            fs.unlinkSync(file.path);
          })
      )
    );

    const todo = await Todo({
      title,
      description,
      images: uploadResults,
    });
    const savedTodo = await todo.save();
    console.log("savedTodo", savedTodo);
    res.status(201).json({
      message: "Todo created successfully",
      todo: savedTodo,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "Failed to create todo",
    });
  }
});

module.exports = todoRouter;
