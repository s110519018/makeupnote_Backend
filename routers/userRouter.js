const express = require('express');
const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require('../models/userModel');
const userRouter = express.Router();
const { getToken, isAuth } = require("../util");

userRouter.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    await User.deleteMany({});
    const createdUsers = await User.insertMany(data.users);
    res.send({ createdUsers });
  })
);
//登入
userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          password: user.password,
          isAdmin: user.isAdmin,
          year: user.year,
          month: user.month,
          day: user.day,
          sex: user.sex,
          token: getToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);
//註冊
userRouter.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    const { name, email, password, year, month, day, sex } = req.body;
    const user = new User({
      name,
      email,
      password: bcrypt.hashSync(password, 8),
      year,
      month,
      day,
      sex,
    });
    const createdUser = await user.save();
    res.send({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      password: createdUser.password,
      isAdmin: createdUser.isAdmin,
      year: createdUser.year,
      month: createdUser.month,
      day: createdUser.day,
      sex: createdUser.sex,
      token: getToken(user),
    });
  })
);
//改資料
userRouter.put(
  "/profile/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { name, email, password, year, month, day, sex } = req.body;
    // password = bcrypt.hashSync(req.body.password, 8);
    const psw = bcrypt.hashSync(password, 8);
    User.findOneAndUpdate({ _id: req.params.id }, {
      "name": name,
      "email": email,
      "password": psw,
      "year": year,
      "month": month,
      "day": day,
      "sex": sex,
    }, { new: true }, (err, doc) => {
      if (err) {
        console.log("Something wrong when updating data!");
      }
      console.log(doc);
    });
    const user = await User.findById({ _id: req.params.id });
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      password: user.password,
      year: user.year,
      month: user.month,
      day: user.day,
      sex: user.sex,
      token: getToken(user),
    });
  })
);

module.exports = userRouter;