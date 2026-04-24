const express = require("express");
const multer = require("multer");
const uploadFile = require("./services/storage.service");
const postModel = require("./models/post.model");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.post("/post-create", upload.single("image"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);

  const result = await uploadFile(req.file.buffer);

  const post = await postModel.create({
    image: result.url,
    caption: req.body.caption,
  });
  res.status(201).json({
    message: "Post created successfully",
    post,
  });
});

app.get("/posts", async (req, res) => {
  const posts = await postModel.find();
  res.status(200).json({
    message: "Posts fetched successfully",
    posts,
  });
});

app.delete("/posts/:id", async (req, res) => {
  const id = req.params.id;
  await postModel.findOneAndDelete({ _id: id });
  res.status(200).json({
    message: "Post deleted successfully",
  });
});

app.patch("/posts/:id", async (req, res) => {
  const id = req.params.id;
  const caption = req.body.caption;
  await postModel.findOneAndUpdate({ _id: id }, { caption: caption });
  res.status(200).json({
    message: "Post updated successfully",
  });
});

module.exports = app;
