const mongoose = require('mongoose');

const automationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  active: { type: Boolean, default: true },
  trigger: {
    type: { type: String, enum: ['time', 'event', 'webhook', 'manual'], required: true },
    config: mongoose.Schema.Types.Mixed
  },
  actions: [{
    type: { type: String, enum: ['claude', 'notion', 'github', 'email', 'webhook', 'custom'], required: true },
    config: mongoose.Schema.Types.Mixed,
    order: Number
  }],
  schedule: {
    cron: String,
    timezone: { type: String, default: 'Europe/Istanbul' }
  },
  lastRun: Date,
  nextRun: Date,
  runCount: { type: Number, default: 0 },
  logs: [{
    date: Date,
    status: { type: String, enum: ['success', 'error', 'running'] },
    message: String,
    duration: Number
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Automation', automationSchema);
