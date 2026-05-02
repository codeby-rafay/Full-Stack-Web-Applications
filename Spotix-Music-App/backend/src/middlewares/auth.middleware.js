const jwt = require("jsonwebtoken");

const authArtist = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "artist") {
      return res.status(403).json({ message: "You don't have access" });
    }

    req.user = decoded;

    next();
  } catch (error) {
    res.status(400).json({ message: "Unauthorized" });
  }
};

const authUser = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "user") {
      return res.status(403).json({ message: "You don't have access" });
    }

    req.user = decoded;

    next();
  } catch (error) {
    res.status(400).json({ message: "Unauthorized" });
  }
};

module.exports = { authArtist, authUser };
