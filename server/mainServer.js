import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import uploads from "./routes/uploads.js";
dotenv.config();

const app = express();

// CORS middleware should be first
// ...
// CORS middleware should be first
const allowedOrigins = process.env.FRONTEND_URL?.split(",");

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);
// ...

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static("public"));

// Routes - should come after CORS and body parsing
app.use("/uploads", uploads);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

let port = process.env.PORT || 5002;

app.post("/create-order", async (req, res) => {
  try {
    const { amount, currency } = req.body;
    if (!amount || !currency) {
      return res.status(400).json({ error: "Amount and currency required" });
    }

    const options = {
      amount: amount * 100,
      currency,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/get-order/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({ error: "order id is not found" });
    }
    const order = await razorpay.orders.fetch(orderId);
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Bill pdf of user purchases

app.use("/user-bill", uploads);

// Add a health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

app.listen(port, () => {
  console.log(`Payment server is running on port ${port}`);
});
