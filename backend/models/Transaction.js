const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'TRY' },
  category: { type: String, required: true },
  subcategory: String,
  description: String,
  date: { type: Date, default: Date.now },
  recurring: {
    enabled: { type: Boolean, default: false },
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'] },
    endDate: Date
  },
  relatedTo: {
    type: { type: String, enum: ['application', 'routine'] },
    id: mongoose.Schema.Types.ObjectId
  },
  paymentMethod: String,
  receipt: String,
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
