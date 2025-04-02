const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, default:1 },
  sizes: [
    {
      size: { type: String, required: true },
      price: { type: Number, required: true }
    }
  ], // Only applies to pizzas; for other items, it can be empty
  price: { type: Number }, // For items without sizes
  image: { type: String, required: true }
});

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

module.exports = MenuItem;
