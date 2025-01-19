const express = require("express");
const User = require("../models/User.js");
const router = express.Router();

router.post("/addUser", async (req, res) => {
  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ message: "Wallet address is required" });
  }

  try {
    const existingUser = await User.findOne({ walletAddress });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    let myDate = new Date("2016-05-18T16:00:00Z");
    const newUser = new User({
      address : walletAddress,
      validUntil: myDate,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
