const router = require("express").Router();
// const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const conn = require("../DB.js");
const { v4: uuidv4 } = require("uuid");

// Registering the user

router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    if (req.body.username && req.body.email) {
      const userId = uuidv4();
      const q =
        "INSERT INTO user (`id`,`username`, `password`,`email`, `isAdmin`) VALUES (?)";
      const values = [
        userId,
        req.body.username,
        hashedPass,
        req.body.email,
        req.body.isAdmin,
      ];
      conn.query(q, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {

  const { username, password } = req.body;
  try {

    const user = await new Promise((resolve) => {
      const findUser = "SELECT * FROM user WHERE `username` = ?";
        conn.query(findUser, [username], (err, data) => {
          resolve(data);
        });
    });

    if (user) {

      console.log(user[0].password);
      console.log(password);
      const validate = await bcrypt.compare(password, user[0].password);

      !validate && res.status(400).json({ message: "Wrong password" });

      const accessToken = jwt.sign(
        {
          id: user[0].id,
          isAdmin: user[0].isAdmin,
        },
        process.env.JWT_KEY,
        { expiresIn: "3d" }
      );

      res.status(200).json({ ...user, accessToken });
    }
  } catch (err) {
    res.status(500).json({ message: "Error in request" });
  }
});

module.exports = router;
