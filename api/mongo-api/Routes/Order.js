const router = require("express").Router();
const {
  verifyTokenAndAuth,
  verifyTokenAndAdmin,
  verifyToken,
} = require("./verifyToken");
const Order = require("../Models/Order.js");

// create product

router.post("/", verifyToken , async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.send(savedOrder);
  } catch (err) {
    console.log(err);
  }
});

// update cart

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(500).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Deleting particular post

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Order has been deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get user order
router.get("/find/:userId", verifyTokenAndAuth, async (req, res) => {
  try {
    const order = await Order.findOne({ userId: req.params.id });
    res.status(200).json(order);
  } catch (err) {
    console.log(err);
  }
});

// get all cart

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const Orders = await Order.find();
    res.status(200).json(Orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// We can get monthly incomes

// router.get("/income", verifyTokenAndAdmin, async (req, res) => {
//   const date = new Date();
//   const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
//   const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

//   try {
//     const income = await Order.aggregate([
//       { $match: { createdAt: { $gte: previousMonth } } },
//       {
//         $project: {
//           month: { $month: "$createdAt" },
//           sales: "$amount",
//         },

//         $group: {
//           _id: "$month",
//           total: { $sum: "$sales" },
//         },
//       },
//     ]);
//     res.status(200).send(income)
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

module.exports = router;
