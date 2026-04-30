const musicModel = require("../models/music.model");
const jwt = require("jsonwebtoken");
const { uploadFile } = require("../services/storage.service");

const createMusic = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "artist") {
      return res
        .status(403)
        .json({ message: "Only artists can upload music" });
    }

    const { title } = req.body;
    const file = req.file;

    const result = await uploadFile(file.buffer.toString("base64"));

    const music = await musicModel.create({
      uri: result.url,
      title,
      artist: decoded.id,
    });
    res.status(201).json({ message: "Music uploaded successfully", music });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createMusic };
