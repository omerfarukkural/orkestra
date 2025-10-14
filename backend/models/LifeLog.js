const mongoose = require('mongoose');

const lifeLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['activity', 'achievement', 'mood', 'note', 'photo', 'video'], required: true },
  title: { type: String, required: true },
  description: String,
  date: { type: Date, default: Date.now },
  category: String,
  tags: [String],
  media: [{
    type: String,
    url: String,
    thumbnail: String
  }],
  relatedTo: {
    type: { type: String, enum: ['application', 'routine', 'transaction'] },
    id: mongoose.Schema.Types.ObjectId
  },
  mood: { type: Number, min: 1, max: 10 },
  location: String,
  weather: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LifeLog', lifeLogSchema);
