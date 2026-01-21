import express from "express";
import crypto from "crypto";
import razorpay from "../lib/razorpay.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import User from "../models/User.js";

const router = express.Router();

/* ---------------- CREATE ORDER ---------------- */
router.post("/create-order", protectRoute, async (req, res) => {
  try {
    const options = {
      amount: 19900, // ₹199
      currency: "INR",
      receipt: `receipt_${req.user._id}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Order creation failed" });
  }
});

/* ---------------- VERIFY PAYMENT ---------------- */
router.post("/verify", protectRoute, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // ✅ Payment verified → upgrade user
    await User.findByIdAndUpdate(req.user._id, { isPremium: true });

    res.json({ success: true });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
});

export default router;
