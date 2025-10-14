const express = require('express');
const router = express.Router();
const pushbulletService = require('../services/pushbulletService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/pushbullet/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit
});

// Get user info
router.get('/user', async (req, res) => {
  try {
    const user = await pushbulletService.getUserInfo();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get devices
router.get('/devices', async (req, res) => {
  try {
    const devices = await pushbulletService.getDevices();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recent pushes
router.get('/pushes', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const pushes = await pushbulletService.getPushes(limit);
    res.json(pushes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send note
router.post('/note', async (req, res) => {
  try {
    const { title, body, device_iden } = req.body;
    const result = await pushbulletService.sendNote(title, body, device_iden);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send link
router.post('/link', async (req, res) => {
  try {
    const { title, url, body, device_iden } = req.body;
    const result = await pushbulletService.sendLink(title, url, body, device_iden);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload and send file
router.post('/file', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, body, device_iden } = req.body;
    const filePath = req.file.path;

    const result = await pushbulletService.sendFile(
      filePath,
      title || req.file.originalname,
      body || '',
      device_iden
    );

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json(result);
  } catch (error) {
    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
});

// Send Orkestra APK to phone
router.post('/send-app', async (req, res) => {
  try {
    const { device_iden, file_type } = req.body;
    const result = await pushbulletService.sendOrkestraFile(device_iden, file_type || 'apk');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete push
router.delete('/pushes/:iden', async (req, res) => {
  try {
    const result = await pushbulletService.deletePush(req.params.iden);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
