
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const userrouter = require("./api/routes/users");
const messagerouter = require("./api/routes/message");
const chatrouter = require("./api/routes/chat");
dotenv.config();

// CONNECT TO DB
mongoose.connect("process.env.MONGO_URI", { dbName: "Chat" }).then((result) => {
  console.log("DB CONNECTED");
});

// HAMDLING CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin , X-Requested-With , Content-Type , Accept , Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});
app.use(morgan("dev"));

// PARS BODY
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// ROUTER
app.use("/auth/user", userrouter);
app.use("/message", messagerouter);
app.use("/chat", chatrouter);
app.use("/upload", express.static("upload"));
// HANDLING ERRORS
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
