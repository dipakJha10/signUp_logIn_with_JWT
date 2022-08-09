const router = require("express").Router();
const models = require("../models/models.js");
const userService = models.users;
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { application } = require("express");
const constants = require("../config/config");
const httpStatus = require("http-status");

// register user

router.post("/register", async (req, res) => {
  try {
    const { userName, firstName, lastName, email, password } = req.body;

    if (!(userName && firstName && lastName && email && password)) {
      res.status(400).send("all the input is required");
    }

    const oldUser = await userService.findOne({ userName });
    if (oldUser) {
      return res.status(409).send("user exist, please go to login");
    }
    // encrypted
    encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await userService.create({
      userName: req.body.userName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: email.toLowerCase(),
      password: encryptedPassword,
      mobile: req.body.mobile,
      address: req.body.address,
    });
    delete newUser.password;
    //create token
    const token = jsonwebtoken.sign(
      { newUser: newUser.userName, newUser: email },
      constants.secret_key
    );
    // save user token

    newUser.token = token;

    // return new user

    res.status(201).json(newUser);
  } catch (err) {
    console.log(err);
  }
});

// logIn user

router.post("/logIn", async (req, res) => {
  try {
    // user input

    const { userName, password } = req.body;

    // checking user input

    if (!(userName && password)) {
      res.status(400).send("all input is required");
    }

    // checking user exist in our database or not
    const user = await userService.findOne({ userName });

    if (user && (await bcrypt.compare(password, user.password))) {
      // create token
      const token = jsonwebtoken.sign(
        { userName: userService.userName },
        constants.secret_key,
        {
          expiresIn: "2h",
        }
      );
      // save user token;

      user.token = token;

      // user

      return res.status(200).json(user);
    }
    res.status(400).send("Invalid credentials");
  } catch (exception) {
    console.log(exception);
  }
});

// get all users

router.get("/getAllUsers", async (req, res) => {
  let offset;
  let limit;
  if (req.query.pageNo && req.query.perPage) {
    req.query.perPage = parseInt(req.query.perPage);
    req.query.pageNo = parseInt(req.query.pageNo);
    offset = req.query.perPage * (req.query.pageNo - 1);
    limit = req.query.perPage;
  } else {
    offset = 0;
    limit = 2;
  }
  try {
    const users = await userService.find({}).skip(offset).limit(limit);
    res.status(200).json({
      status: httpStatus.OK,
      message: "Request Success Full!!",
      data: users,
      count: users.length,
    });
  } catch (exception) {
    console.log(exception);
    res.status(500).send({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Request not completed!!",
      data: null,
    });
  }
});

// update api

router.put("/updateUser", async (req, res) => {
  try {
    const updateUser = await userService.findOneAndUpdate(req.params.token, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      mobile: req.body.mobile,
      address: req.body.address,
    });

    res.status(200).json({
      status: httpStatus.OK,
      message: "Request Success Full!!",
      data: updateUser,
    });
  } catch (exception) {
    console.log(exception);
    res.status(500).send({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Request not completed!!",
      data: null,
    });
  }
});

// search api on (first name, last name, email, mobile no) single key with token and pagination

router.get("/searchUser", async (req, res) => {
  let offset;
  let limit;
  if (req.query.pageNo && req.query.perPage) {
    req.query.perPage = parseInt(req.query.perPage);
    req.query.pageNo = parseInt(req.query.pageNo);
    offset = req.query.perPage * (req.query.pageNo - 1);
    limit = req.query.perPage;
  } else {
    offset = 0;
    limit = 2;
  }
  try {
    let findobjquery = {};
    if (req.query.firstName) {
      findobjquery.firstName = req.query.firstName;
    }
    if (req.query.lastName) {
      findobjquery.lastName = req.query.lastName;
    }
    if (req.query.email) {
      findobjquery.email = req.query.email;
    }
    if (req.query.mobile) {
      findobjquery.mobile = req.query.mobile;
    }
    const findUser = await userService
      .find(findobjquery)
      .skip(offset)
      .limit(limit);
    console.log(findUser);
    res.status(200).json({
      status: httpStatus.OK,
      message: "Request Success Full!!",
      data: findUser,
    });
  } catch (exception) {
    res.status(500).send({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Request not completed!!",
      data: null,
    });
  }
});

module.exports = router;
