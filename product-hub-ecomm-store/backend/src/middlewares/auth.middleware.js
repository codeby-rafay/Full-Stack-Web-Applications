const jwt = require("jsonwebtoken");

const extractToken = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  return token || null;
};

const authAdmin = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "You don't have access" });
    }

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Error occurred while verifying admin token:", error);
    res.status(401).json({ message: "Token expired or invalid" });
  }
};

const authUser = async (req, res, next) => {
  const token = extractToken(req);
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
    console.error("Error occurred while verifying user token:", error);
    res.status(401).json({ message: "Token expired or invalid" });
  }
};

const authAny = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error occurred while verifying token:", error);
    res.status(401).json({ message: "Token expired or invalid" });
  }
};

module.exports = {
  authAdmin,
  authUser,
  authAny,
};
