const express = require('express');
const router = express.Router();
const Routine = require('../models/Routine');

// Get all routines
router.get('/', async (req, res) => {
  try {
    const routines = await Routine.find({ user: req.user._id }).sort('name');
    res.json(routines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create routine
router.post('/', async (req, res) => {
  try {
    const routine = new Routine({
      ...req.body,
      user: req.user._id
    });
    await routine.save();
    res.status(201).json(routine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Complete routine
router.post('/:id/complete', async (req, res) => {
  try {
    const routine = await Routine.findOne({ _id: req.params.id, user: req.user._id });
    if (!routine) return res.status(404).json({ error: 'Routine not found' });

    routine.completionHistory.push({
      date: new Date(),
      completed: true,
      notes: req.body.notes
    });

    routine.streak += 1;
    await routine.save();

    res.json(routine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update routine
router.put('/:id', async (req, res) => {
  try {
    const routine = await Routine.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!routine) return res.status(404).json({ error: 'Routine not found' });
    res.json(routine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete routine
router.delete('/:id', async (req, res) => {
  try {
    const routine = await Routine.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!routine) return res.status(404).json({ error: 'Routine not found' });
    res.json({ message: 'Routine deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
