const express = require('express');
const router = express.Router();
const healthMonitor = require('../services/healthMonitor');

// Get all services health status
router.get('/services', async (req, res) => {
  try {
    const health = await healthMonitor.checkAllServices();
    res.json(health);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific service health
router.get('/services/:name', async (req, res) => {
  try {
    const metrics = await healthMonitor.getServiceMetrics(req.params.name);
    res.json(metrics);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Get system status
router.get('/system', async (req, res) => {
  try {
    const status = await healthMonitor.getSystemStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Restart service (instruction only)
router.post('/services/:name/restart', async (req, res) => {
  try {
    const instruction = await healthMonitor.restartService(req.params.name);
    res.json(instruction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
