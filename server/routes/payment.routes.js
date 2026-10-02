const express = require('express');
const { requireAuth } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const Job = require('../models/Job');
const Transaction = require('../models/Transaction');
const { createRazorpayOrder, verifyPaymentSignature } = require('../services/razorpay');

const router = express.Router();

// ---------- CREATE RAZORPAY ORDER ----------
router.post('/create-order', requireAuth, async (req, res, next) => {
  try {
    const { amount, jobId, type = 'Token Deposit' } = req.body;
    const amountINR = Number(amount) || 99;

    const order = await createRazorpayOrder(amountINR, `receipt_${jobId || Date.now()}`);

    if (jobId) {
      await Transaction.create({
        userId: req.user._id,
        jobId,
        type,
        amount: amountINR,
        status: 'Pending',
        razorpayOrderId: order.id
      });
    }

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency || 'INR',
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_localfix123'
    });
  } catch (error) {
    next(error);
  }
});

// ---------- VERIFY RAZORPAY PAYMENT ----------
router.post('/verify-payment', requireAuth, async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, jobId, type = 'Token Deposit' } = req.body;

    const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid Razorpay payment signature' });
    }

    if (jobId) {
      const job = await Job.findById(jobId);
      if (job) {
        if (type === 'Token Deposit') job.tokenPaid = true;
        if (type === 'Job Payment') job.finalPaymentPaid = true;
        await job.save();
      }

      await Transaction.updateOne(
        { razorpayOrderId: razorpay_order_id },
        { status: 'Success', razorpayPaymentId: razorpay_payment_id }
      );
    }

    res.json({ ok: true, message: 'Payment verified successfully!' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
