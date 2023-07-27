const router = require("express").Router();
const {
  verifyTokenAndAuth,
  verifyTokenAndAdmin,
  verifyToken,
} = require("./verifyToken");
const conn = require("../DB.js");
const { v4: uuidv4 } = require("uuid");

// order

router.post("/", verifyToken, async (req, res) => {
  
  // https://stackoverflow.com/questions/16240041/sql-search-multiple-values-in-same-field

  try {
    const orderid = uuidv4();

    const q =
      "INSERT INTO orders (`OrderId`, `userId`, `products`, `amount`, `address`, `status`) VALUES (?)";

    const values = [
      orderid,
      req.body.userId,
      req.body.products,
      req.body.amount,
      req.body.address,
      req.body.status,
    ];

    conn.query(q, [values], (err, data) => {
      if (err) return res.json(err);
      res.json(data);
    });
  } catch (err) {
    console.log(err);
  }
});

// update cart

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orderId = req.params.id;

    const q =
      "UPDATE orders SET `userId` = ?, `products` = ?, `amount` = ?, `address`  = ?, `status`= ? WHERE OrderId = ?";

    const values = [
      req.body.userId,
      req.body.products,
      req.body.amount,
      req.body.address,
      req.body.status,
    ];

    conn.query(q, [...values, orderId], (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Deleting particular order

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orderId = req.params.id;
    const q = "DELETE FROM orders OrderId = ?";
    conn.query(q, [orderId], (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get user order
router.get("/find/:userId", verifyTokenAndAuth, async (req, res) => {
  try {
    const userId = req.params.userId;
    const q = "SELECT * FROM orders WHERE userId = ?";
    conn.query(q, [userId], (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  } catch (err) {
    console.log(err);
  }
});

// get all cart

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const q = "SELECT * FROM orders";

    conn.query(q, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
