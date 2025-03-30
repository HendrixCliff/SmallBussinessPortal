const Product = require("../models/productSchema");
const Order = require("../models/orderSchema");
const asyncErrorHandler = require("../Utils/asyncErrorHandler"); // Ensure correct path

// 🔹 Place an Order
exports.placeAnOrder = asyncErrorHandler(async (req, res) => {
  const { products } = req.body; // Expect [{ productId, quantity }, ...]

  let totalAmount = 0;

  // Loop through products to check stock & calculate total price
  for (let item of products) {
    let product = await Product.findById(item.productId);
    if (!product || product.stock < item.quantity) {
      return res.status(400).json({ error: `Insufficient stock for ${product?.name}` });
    }
    totalAmount += product.price * item.quantity;
  }

  // If stock is available, update stock and create order
  const newOrder = new Order({ products, totalAmount });
  await newOrder.save();

  // Reduce stock for each product
  for (let item of products) {
    await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
  }

  res.json({ message: "Order placed successfully!", order: newOrder });
});

// 🔹 Get All Placed Orders
exports.getAllPlacedOrders = asyncErrorHandler(async (req, res) => {
  const soldItems = await Order.aggregate([
    { $unwind: "$products" }, // Break products array into individual documents
    {
      $group: {
        _id: "$products.productId",
        totalSold: { $sum: "$products.quantity" },
      },
    },
    {
      $lookup: {
        from: "products", // Join with Products collection
        localField: "_id",
        foreignField: "_id",
        as: "productDetails",
      },
    },
  ]);

  res.json(soldItems);
});
