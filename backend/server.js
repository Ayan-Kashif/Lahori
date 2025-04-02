const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path')
app.use(cors());
app.use(express.json());
require('dotenv').config({ path: '../.env' });

// pages/api/send-sms.js
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;


mongoose.connect("mongodb://localhost:27017/restaurant", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const Feedback = require('./models/feedbackModel')
const MenuItem = require("./models/menuItemModel");
const Order = require("./models/orderModel");
const Admin = require('./models/adminModel')

app.get("/api/menu", async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: "Error fetching menu items" });
  }
});




// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../public/images")); // Store in restaurant/public/images
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
  },
});

// Fix __dirname for ES module
const __dirName = path.resolve();

// Serve static files from the uploads folder
app.use('/images', express.static(path.join(__dirName, 'images')));



// Configure Multer for file uploads

const upload = multer({ storage });



//Customer Routes

// Customer Order Placement
app.post('/api/order', async (req, res) => {

  try {

    const { user, items, total, deliveryMethod } = req.body;

    // Validate fields
    if (!user?.name || !user?.phone || !items || !items.length || !total || !deliveryMethod) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Validate phone number (Pakistan format)
    if (!/^03[0-9]{9}$/.test(user.phone)) {
      return res.status(400).json({ error: "Invalid phone number. Must be 11 digits and start with 03." });
    }

    // Create and save order
    const newOrder = new Order({
      customerName: user?.name,
      customerPhone: user?.phone,
      address: user?.address,
      items,
      totalAmount: total,
      deliveryMethod,
      status: "Pending",
      createdAt: new Date(),
    });

    await newOrder.save();
    return res.status(201).json({ message: "Order placed successfully!" });

  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Server error. Try again later." });
  }


})


// Customer Feedback Route
app.post("/api/feedback", async (req, res) => {
  const { orderId, name, feedback, phone, email, channel, visitDate, rating } = req.body;

  try {
    // Validate all fields
    if (!orderId || !name || !feedback || !phone || !email || !channel || !visitDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the order exists for the user
    const order = await Order.findOne({ _id: orderId });

    if (!order) {
      return res.status(404).json({ message: "Invalid Order Id" });
    }

    // Save feedback
    const feedbackData = new Feedback({
      orderId,
      name,
      feedback,
      phone,
      email,
      channel,
      rating,
      visitDate,
    });

    await feedbackData.save();

    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (err) {
    console.error("Error submitting feedback:", err);
    res.status(500).json({ message: "Error submitting feedback" });
  }
});




// Admin Routes

//Analytics for Dashboard
app.get("/admin/stats", async (req, res) => {
  try {
    // Count all orders
    const totalOrders = await Order.countDocuments();

    // Revenue from completed orders (Delivered or Ready)
    const completedRevenue = await Order.aggregate([
      { $match: { status: { $in: ["Delivered", "Ready"] } } }, // Filter by status
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    // Get unique customer names for totalUsers
    const uniqueCustomers = await Order.distinct("customerName");
    const totalUsers = uniqueCustomers.length;

    // Get recent orders (latest 5)
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    // Get recent feedbacks (latest 5)
    const recentFeedbacks = await Feedback.find().sort({ createdAt: -1 }).limit(5);

    // Separate Pending and In Progress orders
    const pendingOrders = await Order.find({ status: { $in: ["Pending", "In Progress"] } });

    res.json({
      totalOrders,
      totalRevenue: completedRevenue[0]?.total || 0, // Revenue from completed orders
      totalUsers, // Unique customers
      recentOrders, // Latest users (customers)
      recentFeedbacks, // Latest feedbacks
      pendingOrders, // If you want to display them separately
    });

  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// Token Validation
app.get("/admin/validate-token", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];  // Extract token from 'Bearer <token>'

  if (!token) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const secretKey = process.env.JWT_SECRET_KEY;
  console.log(process.env.JWT_SECRET_KEY)

  try {

    const currentTimestamp = Math.floor(Date.now() / 1000);  // Current Unix timestamp

    // Expiration timestamp from the token
    const expTimestamp = 1735321910;

    if (currentTimestamp > expTimestamp) {
      console.log("Token has expired");
    } else {
      console.log("Token is still valid");
    }
    // Verify token
    // Verify the token
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        console.log("Token is invalid or expired", err);
      } else {
        console.log("Decoded Token:", decoded);
      }
    })
    res.json({ message: 'Authorized' });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: 'Unauthorized' });
  }
});






// Login Route
app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password)

  try {
    const admin = await Admin.findOne({ username });
    console.log(admin)
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });


    // ✅ CORRECT: Compare plain password with hashed one
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("🔹 Password match result:", isMatch);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
    return res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});


// Change Password Route
app.put("/admin/change-password", async (req, res) => {
  const { oldPassword, newPassword } = req.body;


  try {
    const admin = await Admin.findOne();
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    await admin.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});



// Update Order Status Route
app.put("/admin/orders/:id", async (req, res) => {
  const { status } = req.body;  // Status value (Pending, In Progress, Delivered)
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Failed to update order", error: err });
  }
});


// All Orders Route
app.get("/admin/orders", async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch all orders from the database
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});


// Pending Orders Route
app.get("/admin/orders/not-delivered", async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ status: "Pending" }, { status: "In Progress" }]
    }); // Fetch all orders that are not delivered
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Feedbacks Route
app.get("/admin/feedbacks", async (req, res) => {
  try {
    const feedbacks = await Feedback.find(); // Fetch all orders from the database
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});



// Users Route
app.get("/admin/customers", async (req, res) => {
  try {
    // Fetch all orders
    const orders = await Order.find();

    // Group orders by customer name
    const customersWithOrders = orders.reduce((acc, order) => {
      if (!acc[order.customerName]) {
        acc[order.customerName] = [];
      }
      acc[order.customerName].push(order);
      return acc;
    }, {});

    // Convert to array format
    const customers = Object.keys(customersWithOrders).map((name) => ({
      customerName: name,
      orders: customersWithOrders[name],
    }));

    res.json({ customers });

  } catch (error) {
    console.error("Error fetching customers with orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Menu Items Addition Route
// app.post("/admin/add", async (req, res) => {
//   try {
//     const { name, category, image, price, sizes, description } = req.body;

//     // Validate required fields
//     if (!name || !category || !image || !description) {
//       res.status(400).json({ success: false, message: "Name, category, and image are required." });
//     }

//     // Ensure either `price` or `sizes` exists
//     if ((!sizes || sizes.length === 0) && (price === null || price === undefined)) {
//       res.status(400).json({ success: false, message: "Either `price` or `sizes` must be provided." });
//     }

//     // Create new menu item
//     const newItem = new MenuItem({
//       name,
//       category,
//       image,
//       description,
//       price: sizes && sizes.length > 0 ? null : price, // If sizes exist, price should be null
//       sizes
//     });

//     await newItem.save();
//     res.status(201).json({ success: true, message: "Menu item added successfully!", item: newItem });
//   } catch (error) {
//     console.error("Error adding menu item:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// });



app.post("/admin/add", upload.single("image"), async (req, res) => {
  try {
    const { name, category, price, sizes, description } = req.body;

    // Validate required fields
    if (!name || !category || !description) {
      return res.status(400).json({ success: false, message: "Name, category, and description are required." });
    }

    // Get image path if uploaded
    let imagePath = req.file ? `/images/${req.file.filename}` : null;
    if (!imagePath) {
      return res.status(400).json({ success: false, message: "Image is required." });
    }

    // Ensure either `price` or `sizes` exists
    if ((!sizes || sizes.length === 0) && (price === null || price === undefined)) {
      return res.status(400).json({ success: false, message: "Either `price` or `sizes` must be provided." });
    }

    // Convert sizes from JSON string to array (if sent from formData)
    const parsedSizes = sizes ? JSON.parse(sizes) : [];

    // Create new menu item
    const newItem = new MenuItem({
      name,
      category,
      image: imagePath,
      description,
      price: parsedSizes.length > 0 ? null : price, // If sizes exist, price should be null
      sizes: parsedSizes
    });

    await newItem.save();
    res.status(201).json({ success: true, message: "Menu item added successfully!", item: newItem });

  } catch (error) {
    console.error("Error adding menu item:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


// Update menu item
app.put('/admin/update/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description, price, sizes } = req.body;
    
    let sizesArray = [];
    if (sizes) {
      try {
        sizesArray = JSON.parse(sizes);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid sizes format' });
      }
    }

    const item = await MenuItem.findById(id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Delete old image if new one is uploaded
    if (req.file && item.image) {
      const oldImagePath = path.join(__dirname, '../uploads', item.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    item.name = name;
    item.category = category;
    item.description = description;
    item.price = sizesArray.length > 0 ? null : price;
    item.sizes = sizesArray;
    if (req.file) item.image = req.file.filename;

    await item.save();
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete menu item
app.delete('/admin/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find the item first to get image filename
    const item = await MenuItem.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // 2. Delete associated image if exists
    if (item.image) {
      const imagePath = path.join(__dirname, '../public/images', item.image);
      
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath); // Delete the file
        }
      } catch (fsError) {
        console.error('Failed to delete image:', fsError);
        // Continue with DB deletion even if image deletion fails
      }
    }

    // 3. Delete from database
    await MenuItem.findByIdAndDelete(id);

    res.json({ 
      success: true,
      message: 'Menu item deleted successfully' 
    });

  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error during deletion' 
    });
  }
});



app.listen(5000, () => {
  console.log("Server running on port 5000");
});
