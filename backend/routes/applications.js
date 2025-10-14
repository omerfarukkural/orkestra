const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

// Get all applications
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id }).sort('-createdAt');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single application
router.get('/:id', async (req, res) => {
  try {
    const application = await Application.findOne({ _id: req.params.id, user: req.user._id });
    if (!application) return res.status(404).json({ error: 'Application not found' });
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create application
router.post('/', async (req, res) => {
  try {
    const application = new Application({
      ...req.body,
      user: req.user._id
    });
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update application
router.put('/:id', async (req, res) => {
  try {
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!application) return res.status(404).json({ error: 'Application not found' });
    res.json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete application
router.delete('/:id', async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!application) return res.status(404).json({ error: 'Application not found' });
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add phase to application
router.post('/:id/phases', async (req, res) => {
  try {
    const application = await Application.findOne({ _id: req.params.id, user: req.user._id });
    if (!application) return res.status(404).json({ error: 'Application not found' });

    application.phases.push(req.body);
    await application.save();
    res.json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update phase
router.put('/:id/phases/:phaseId', async (req, res) => {
  try {
    const application = await Application.findOne({ _id: req.params.id, user: req.user._id });
    if (!application) return res.status(404).json({ error: 'Application not found' });

    const phase = application.phases.id(req.params.phaseId);
    if (!phase) return res.status(404).json({ error: 'Phase not found' });

    Object.assign(phase, req.body);
    await application.save();
    res.json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
