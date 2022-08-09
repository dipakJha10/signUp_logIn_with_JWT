const jsonwebtoken = require("jsonwebtoken");
const router = require("express").Router();
const constants = require("../config/config");

const verifyToken = (req, res, next) => {
  let decoded;
  const token =
    req.body.token || req.query.token || req.headers["access-token"];

  if (!token) {
    return res.status(403).send("a token is required for authentication");
  }
  try {
    decoded = jsonwebtoken.verify(token, constants.secret_key);
    req.user = decoded;
  } catch (err) {
    console.log(err);
    return res.status(401).send(err);
  }
  res.status(200).send({ message: "Welcome", user: decoded });
};

router.get("/welcome", async (req, res) => {
  verifyToken(req, res);
});

module.exports = router;
