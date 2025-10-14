const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  subdomain: { type: String, required: true },
  rootDirectory: String,
  url: String,
  description: String,
  icon: String,
  status: { type: String, enum: ['active', 'inactive', 'development', 'maintenance'], default: 'active' },
  startDate: Date,
  completionDate: Date,
  daysToComplete: Number,
  technologies: [String],
  phases: [{
    name: String,
    description: String,
    startDate: Date,
    endDate: Date,
    status: { type: String, enum: ['planned', 'in-progress', 'completed', 'on-hold'], default: 'planned' },
    progress: { type: Number, default: 0 }
  }],
  currentPhase: String,
  screenshots: [{ url: String, description: String, date: Date }],
  repository: String,
  deploymentInfo: {
    lastDeployment: Date,
    version: String,
    environment: String
  },
  metrics: {
    users: Number,
    requests: Number,
    uptime: Number
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

applicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Application', applicationSchema);
