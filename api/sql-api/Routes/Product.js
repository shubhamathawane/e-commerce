const { verifyTokenAndAuth, verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();
const Product = require("../Models/Product.js");
const conn = require("../DB.js");
const { v4: uuidv4 } = require("uuid");

// create product

router.post("/", verifyTokenAndAdmin, async (req, res) => {
  // const newProduct = new Product(req.body);
  try {
    // const savedProduct = await newProduct.save();
    // res.send(savedProduct);

    const productId = uuidv4();
    const q =
      "INSERT INTO products (`id`, `title`, `desc`, `img`, `categories`, `size`, `color`, `price`) VALUES (?)";

    const values = [
      productId,
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.categories,
      req.body.size,
      req.body.color,
      req.body.price,
    ];

    conn.query(q, [values], (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  } catch (err) {
    console.log(err);
  }
});

// get all products

router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  const qColor = req.query.color;
  try {
    let products;
    if (qNew) {
      // products = await Product.find().sort({ _id: -1 }).limit(5);

      products = await new Promise((resolve) => {
        const productQuery =
          "SELECT * FROM `products` ORDER BY timestamp desc LIMIT 5;";
        conn.query(productQuery, (err, data) => {
          resolve(data);
        });
      });
    } else if (qCategory) {
      // products = await Product.find({
      //   categories: {
      //     $in: [qCategory],
      //   },
      // });

      products = await new Promise((resolve) => {
        const productQuery =
          "SELECT * FROM products WHERE FIND_IN_SET((?),categories);";
        // https://www.mysqltutorial.org/mysql-find_in_set/

        conn.query(productQuery, [qCategory], (err, data) => {
          resolve(data);
        });
      });
    } else if (qColor) {
      products = await new Promise((resolve) => {
        const productQuery =
          "SELECT * FROM products where find_in_set((?), color);";
        conn.query(productQuery, [qColor], (err, data) => {
          resolve(data);
        });
      });
    } else {
      // products = await Product.find();

      products = await new Promise((resolve) => {
        const productQuery = "SELECT * FROM products";

        conn.query(productQuery, (err, data) => {
          resolve(data);
        });
      });
    }
    res.status(200).json(products);
  } catch (err) {
    console.log(err);
  }
});

// update product
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    // const updatedProduct = await Product.findByIdAndUpdate(
    //   req.params.id,
    //   {
    //     $set: req.body,
    //   },
    //   { new: true }
    // );
    // res.status(500).json(updatedProduct);

    const q =
      "UPDATE products SET `title` = ?, `desc`= ?, `img`= ?, `categories`= ?, `size`= ?, `color`= ?, `price`= ? WHERE `id` = ?";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.categories,
      req.body.size,
      req.body.color,
      req.body.price,
    ];

    conn.query(q, [...values, req.params.id], (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Deleting particular post
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    // await Product.findByIdAndDelete(req.params.id);
    // res.status(200).json({ message: "Product has been deleted" });

    const productId = req.params.id;
    const q = "DELETE FROM products WHERE id = ?";

    conn.query(q, [productId], (err, data) => {
      if (err) return res.json(err);
      return res.json({ message: `${productId} is deleted!` });
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get product
router.get("/:id", async (req, res) => {
  let products;
  const productId = req.params.id;
  try {
    // const product = await Product.findById(req.params.id);
    // res.status(200).json(product);

    products = await new Promise((resolve) => {
      const productQuery = "SELECT * FROM products WHERE id = ?";

      conn.query(productQuery, [productId], (err, data) => {
        resolve(data);
      });
    });

    res.status(200).json(products);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
