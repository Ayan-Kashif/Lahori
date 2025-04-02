const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({


    customerName: { type: String, required: true }, // Customer Name
    customerPhone: { type: String, required: true }, // Phone Number
    address: { type: String, required: true }, // Delivery Address
    items: [
        {
            name: { type: String, required: true }, // Item Name
            category: { type: String, required: true }, // Category (Pizza, Shake, etc.)
            selectedSize: { type: String }, // Selected Size (if applicable)

            quantity: { type: Number, required: true, min: 1, default: 1 }, // Quantity of item
            price: { type: Number, required: true }, // Price based on selectedSize/type
        }
    ],
    totalAmount: { type: Number, required: true }, // Total bill calculated
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Delivered", "Ready"],
        default: "Pending", // Order starts as pending
    }, 
    deliveryMethod: { type: String, enum: ["Delivery", "Pickup"], required: true },
    createdAt: { type: Date, default: Date.now }, // Order timestamp
});

const Order = mongoose.model('Order',OrderSchema)

module.exports = Order;

