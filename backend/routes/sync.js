const express = require('express');
const router = express.Router();
const notionService = require('../services/notionService');
const Application = require('../models/Application');
const LifeLog = require('../models/LifeLog');
const Transaction = require('../models/Transaction');

// Sync all data to Notion
router.post('/notion/all', async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id });
    const lifeLogs = await LifeLog.find({ user: req.user._id });
    const transactions = await Transaction.find({ user: req.user._id });

    const results = {
      applications: await notionService.syncApplications(applications),
      lifeLogs: await notionService.syncLifeLogs(lifeLogs),
      transactions: await notionService.syncTransactions(transactions)
    };

    res.json({ message: 'Sync completed', results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sync applications only
router.post('/notion/applications', async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id });
    const results = await notionService.syncApplications(applications);
    res.json({ message: 'Applications synced', results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sync life logs only
router.post('/notion/lifelogs', async (req, res) => {
  try {
    const lifeLogs = await LifeLog.find({ user: req.user._id });
    const results = await notionService.syncLifeLogs(lifeLogs);
    res.json({ message: 'Life logs synced', results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sync transactions only
router.post('/notion/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id });
    const results = await notionService.syncTransactions(transactions);
    res.json({ message: 'Transactions synced', results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
