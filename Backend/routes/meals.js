const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');
const { protect, cookOnly } = require('../middleware/auth');

// GET /api/meals — public browse
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = { isAvailable: true, quantity: { $gt: 0 } };
    if (category && category !== 'all') filter.category = category;
    if (search) filter.mealName = { $regex: search, $options: 'i' };

    const meals = await Meal.find(filter)
      .populate('cookId', 'name avatar address phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: meals.length, meals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/meals/my — cook's own meals
router.get('/my', protect, cookOnly, async (req, res) => {
  try {
    const meals = await Meal.find({ cookId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, meals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/meals/:id
router.get('/:id', async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id).populate('cookId', 'name avatar address phone');
    if (!meal) return res.status(404).json({ success: false, message: 'Meal not found.' });
    res.json({ success: true, meal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/meals
router.post('/', protect, cookOnly, async (req, res) => {
  try {
    const meal = await Meal.create({ ...req.body, cookId: req.user._id });
    res.status(201).json({ success: true, meal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/meals/:id
router.put('/:id', protect, cookOnly, async (req, res) => {
  try {
    const meal = await Meal.findOne({ _id: req.params.id, cookId: req.user._id });
    if (!meal) return res.status(404).json({ success: false, message: 'Meal not found or unauthorized.' });
    Object.assign(meal, req.body);
    await meal.save();
    res.json({ success: true, meal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/meals/:id
router.delete('/:id', protect, cookOnly, async (req, res) => {
  try {
    const meal = await Meal.findOneAndDelete({ _id: req.params.id, cookId: req.user._id });
    if (!meal) return res.status(404).json({ success: false, message: 'Meal not found or unauthorized.' });
    res.json({ success: true, message: 'Meal deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
