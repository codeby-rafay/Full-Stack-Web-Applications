require("dotenv").config();
const express = require("express");
const cors = require("cors");
// const morgan = require("morgan")
const cookies = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const orderRoutes = require("./routes/order.routes");
const notificationRoutes = require("./routes/notification.routes");
const feedbackRoutes = require("./routes/feedback.routes");

const app = express();

// middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookies());
// app.use(morgan("dev"));

app.use("/api", authRoutes);
app.use("/api", orderRoutes);
app.use("/api", notificationRoutes);
app.use("/api", feedbackRoutes);

module.exports = app;
