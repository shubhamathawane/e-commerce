const { verifyTokenAndAuth, verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();
const User = require("../Models/User.js");
const bcrypt = require("bcrypt");

router.put("/:id", verifyTokenAndAuth, async (req, res) => {
  // checking whether token belong to who

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  try {
    // const updatedUser = await User.findByIdAndUpdate(
    //   req.params.id,
    //   {
    //     $set: req.body,
    //   },
    //   { new: true }
    // );
    // res.json(updatedUser);

    const UpdatedUser = await new Promise((resolve) => {
      const q = "UPDATE user SET `username` = ?, `password` = ? WHERE  id = ?";
      const values = [req.body.username, req.body.password, req.body.id];
      conn.query(q, values, (err, data) => {
        if (err) res.status(500).json(err);
        resolve(data);
      });
    });

    res.json(UpdatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Deleting the user
router.delete("/:id", verifyTokenAndAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "user has been deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get users
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json({ ...others });
  } catch (err) {
    console.log(err);
  }
});

// get all users

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  
  const query = req.query.new;

  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    if (users) res.status(200).json(users);
    else res.json({ message: "Users not found" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
