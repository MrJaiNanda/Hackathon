const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Meal = require('../models/Meal');
const { protect, cookOnly, customerOnly } = require('../middleware/auth');

// POST /api/orders — place order
router.post('/', protect, customerOnly, async (req, res) => {
  try {
    const { mealId, quantity, deliveryAddress, note } = req.body;

    const meal = await Meal.findById(mealId);
    if (!meal) return res.status(404).json({ success: false, message: 'Meal not found.' });
    if (!meal.isAvailable || meal.quantity < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient quantity available.' });
    }

    const order = await Order.create({
      customerId: req.user._id,
      cookId: meal.cookId,
      mealId,
      quantity,
      totalPrice: meal.price * quantity,
      deliveryAddress,
      note,
    });

    meal.quantity -= quantity;
    if (meal.quantity === 0) meal.isAvailable = false;
    await meal.save();

    const populated = await order.populate([
      { path: 'mealId', select: 'mealName price' },
      { path: 'cookId', select: 'name' },
    ]);

    res.status(201).json({ success: true, order: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/my — customer orders
router.get('/my', protect, customerOnly, async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user._id })
      .populate('mealId', 'mealName price category')
      .populate('cookId', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/cook — cook's incoming orders
router.get('/cook', protect, cookOnly, async (req, res) => {
  try {
    const orders = await Order.find({ cookId: req.user._id })
      .populate('mealId', 'mealName price category')
      .populate('customerId', 'name phone address avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/orders/:id/status — update status (cook only)
router.patch('/:id/status', protect, cookOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!valid.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }
    const order = await Order.findOne({ _id: req.params.id, cookId: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    order.status = status;
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
