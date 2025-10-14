const express = require('express');
const router = express.Router();
const LifeLog = require('../models/LifeLog');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/lifelogs/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Get all life logs
router.get('/', async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    const query = { user: req.user._id };

    if (type) query.type = type;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const logs = await LifeLog.find(query).sort('-date');
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create life log
router.post('/', upload.array('media', 5), async (req, res) => {
  try {
    const logData = { ...req.body, user: req.user._id };

    if (req.files && req.files.length > 0) {
      logData.media = req.files.map(file => ({
        type: file.mimetype.startsWith('image/') ? 'image' : 'video',
        url: `/uploads/lifelogs/${file.filename}`,
        thumbnail: `/uploads/lifelogs/${file.filename}`
      }));
    }

    const log = new LifeLog(logData);
    await log.save();
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update life log
router.put('/:id', async (req, res) => {
  try {
    const log = await LifeLog.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!log) return res.status(404).json({ error: 'Life log not found' });
    res.json(log);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete life log
router.delete('/:id', async (req, res) => {
  try {
    const log = await LifeLog.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!log) return res.status(404).json({ error: 'Life log not found' });
    res.json({ message: 'Life log deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
