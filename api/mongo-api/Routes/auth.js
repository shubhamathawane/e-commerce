const router = require("express").Router();
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Registering the user

router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: "Cannot create user1" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    // if user does not exist
    !user && res.status(404).json({ message: "User does not exist" });

    // checking for the password
    const validate = await bcrypt.compare(req.body.password, user.password);

    // if password does not match
    !validate && res.status(400).json({ message: "Wrong Password" });

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_KEY,
      { expiresIn: "3d" }
    );

    const { password, ...other } = user._doc;

    res.status(200).json({ ...other, accessToken });
  } catch (err) {
    res.status(500).json({ message: "Cannot Login ! Wrong credentials" });
  }
});

module.exports = router;
