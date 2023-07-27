const router = require("express").Router();
const {
  verifyTokenAndAuth,
  verifyTokenAndAdmin,
  verifyToken,
} = require("./verifyToken");
const conn = require("../DB.js");

// create product

router.post("/", verifyToken, async (req, res) => {
  // const newCart = new Cart(req.body);
  try {
    // const savedCart = await newCart.save();
    // res.send(savedCart);
    const q =
      "INSERT INTO cart (`userId`, `product_id`, `quantity`) VALUES (?)";

    const values = [req.body.userId, req.body.product_id, req.body.quantity];

    conn.query(q, [values], (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  } catch (err) {
    console.log(err);
  }
});

// update cart

router.put("/:id", verifyTokenAndAuth, async (req, res) => {
  try {
    // const q =
    //   "UPDATE cart SET (`userId` = ?, `product_id` = ?, `quantity` =? ) WHERE product_id = (?)";

    // const values = [req.body.userId, req.body.product_id, req.body.quantity];

    const productId = req.body.id;

    const q = "UPDATE cart SET (`quantity` = ? ) WHERE product_id = (?)";

    const values = [req.body.quantity];

    conn.query(q, [...values, productId], (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Deleting particular post

router.delete("/:id", verifyTokenAndAuth, async (req, res) => {
  try {
    // await Cart.findByIdAndDelete(req.params.id);
    // res.status(200).json({ message: "user has been deleted" });

    const productId = req.body.id;
    const q = "DELETE FROM cart WHERE product_id = (?)";
    conn.query(q, [productId], (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get user cart
router.get("/find/:userId", verifyTokenAndAuth, async (req, res) => {
  try {
    // const cart = await Cart.findOne({ userId: req.params.id });
    // res.status(200).json(cart);

    const q = "SELECT * FROM cart WHERE userId = (?)";

    conn.query(q, [req.params.userId], (err, data) => {
      if (err) return res.json(err);
      res.json(data);
    });
  } catch (err) {
    console.log(err);
  }
});

// get all cart

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    // const carts = await Cart.find();
    // res.status(200).json(carts);

    const q = "SELECT * FROM cart";

    conn.query(q, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
