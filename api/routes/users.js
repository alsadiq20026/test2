const mongoose = require("mongoose");
const User = require("../models/users");
const express = require("express");
const router = express.Router();
const Cryptojs = require("crypto-js");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  const { phone } = req.body;

  try {
    const exectuser = await User.findOne({ phone: phone });
    if (exectuser) {
      res.status(403).json({ message: "user already exest" });
    } else {
      const newuser = {
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        phone: req.body.phone,
        password: Cryptojs.HmacSHA1(req.body.password, "KEY"),
      };
      await User.create(newuser);
      res.status(201).json({ status: "success", newuser: newuser });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const phone = req.body.phone;
  try {
    const user = await User.findOne({ phone: phone });
    if (user) {
      if (
        user.password === Cryptojs.HmacSHA1(req.body.password, "KEY").toString()
      ) {
        const token = jwt.sign(
          {
            id: user._id,
            phone: user.phone,
          },
          "key"
        );
        res.status(200).json({ status: "success", token: token, user, user });
      } else {
        res.status(404).json({ message: "user not found" });
      }
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error });
  }
});
module.exports = router;
