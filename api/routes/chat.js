const mongoose = require("mongoose");
const Chat = require("../models/chat");
const express = require("express");
const router = express.Router();
const { verifytoken } = require("../middleware/check-auth");
const User = require("../models/users");
const chat = require("../models/chat");

router.post("/access", verifytoken, async (req, res) => {
  const { userid } = req.body;
  if (!userid) {
    res.status(400).json({ message: "invalid input" });
  }
  var ischat = await Chat.find({
    isgroup: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user.id } } },
      { users: { $elemMatch: { $eq: userid } } },
    ],
  })
    .populate({ path: "users" })
    .populate({ path: "latestmessage" });

  ischat = await User.populate(ischat, { path: "latestmessage.sender" });
  
  if (ischat.length>0 ) {
    res.json({ status: "success", chat: ischat });
  } else {
    var chatdata = {
      chatname: req.user.id,
      isgroup: false,
      users: [req.user.id, userid],
    };
    try {
      var createdchat = await chat.create(chatdata);
      const fullchat = await Chat.findOne({ _id: createdchat._id }).populate({
        path: "users",
      });
      res.status(201).json({ status: "success", fullchat: fullchat });
    } catch (error) {
      res.json(error);
    }
  }
});
router.get("/", verifytoken, async (req, res) => {
  try {
    await Chat.find({ users: { $elemMatch: { $eq: req.user.id } } })
      .populate({ path: "users" ,select:"-password"})
      .populate({ path: "latestmessage", })
      .sort({ updateAt: -1 })
      .then(async (result) => {
        result = await User.populate(result, { path: "latestmessage.sender" ,select:"-password"});
        res.json(result);
      });
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;