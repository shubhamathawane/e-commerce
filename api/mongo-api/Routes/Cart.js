const router = require("express").Router();
const {
  verifyTokenAndAuth,
  verifyTokenAndAdmin,
  verifyToken,
} = require("./verifyToken");
const Cart = require("../Models/Cart.js");

// create product

router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.send(savedCart);
  } catch (err) {
    console.log(err);
  }
});

// update cart

router.put("/:id", verifyTokenAndAuth, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(500).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Deleting particular post

router.delete("/:id", verifyTokenAndAuth, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "user has been deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get user cart
router.get("/find/:userId", verifyTokenAndAuth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.id });
    res.status(200).json(cart);
  } catch (err) {
    console.log(err);
  }
});

// get all cart

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
