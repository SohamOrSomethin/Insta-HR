const Razorpay = require('razorpay');
const crypto = require('crypto');
const { User } = require('../models/index');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const plans = {
  standard: { amount: 299900, name: 'Standard Plan' },
  premium: { amount: 799900, name: 'Premium Plan' },
  enterprise: { amount: 1999900, name: 'Enterprise Plan' }
}

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { plan } = req.body

    if (!plans[plan]) {
      return res.status(400).json({ success: false, message: 'Invalid plan' })
    }

    const order = await razorpay.orders.create({
      amount: plans[plan].amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    })

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      plan: plans[plan].name,
      keyId: process.env.RAZORPAY_KEY_ID
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body

    const sign = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex')

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' })
    }

    // Update user subscription
    await User.update(
      { subscriptionPlan: plan },
      { where: { id: req.user.id } }
    )

    res.json({
      success: true,
      message: 'Payment verified! Subscription activated!'
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}