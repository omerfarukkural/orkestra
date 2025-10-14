const mongoose = require('mongoose');

const routineSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['daily', 'weekly', 'monthly', 'custom'], required: true },
  schedule: {
    time: String,
    days: [{ type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }],
    frequency: String
  },
  tasks: [{
    name: String,
    duration: Number,
    order: Number,
    completed: { type: Boolean, default: false }
  }],
  category: String,
  color: String,
  icon: String,
  reminders: [{
    time: String,
    type: { type: String, enum: ['notification', 'email'] }
  }],
  streak: { type: Number, default: 0 },
  completionHistory: [{
    date: Date,
    completed: Boolean,
    notes: String
  }],
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Routine', routineSchema);
