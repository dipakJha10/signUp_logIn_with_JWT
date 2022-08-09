const express = require("express");
const app = express();
const db = require("./data/db");
const bodyParser = require("body-parser");
const register = require("./api/userApis");
const router = require("express").Router();
app.use(bodyParser.json());
app.use(router);
const auth = require("./middleware/auth");

app.get("/", function (req, res) {
  res.send({
    status: "ON",
    message: "Services are up an running",
  });
});

app.use("/api", register);
app.use("/middleware", auth);

app.listen(process.env.PORT || 3000, () => {
  console.log("server is up at 3000");
});
