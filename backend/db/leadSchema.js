const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true }, // Index for name for faster searches
  address: { type: String, required: true },
  leadStatus: { 
    type: String, 
    required: true, 
    enum: ['New', 'In Progress', 'Converted'],
    index: true // Index for leadStatus for filtering
  },
  contacts: [
    {
      name: String,
      role: String,
      phone: String,
      email: String,
    },
  ],
  interactions: [
    {
      date: { type: Date, required: true, index: true }, // Index for interaction date for sorting
      summary: { type: String, required: true },
      outcome: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
      type: { 
        type: String, 
        enum: ['KAM-to-lead', 'Lead-to-POC'], 
        required: true 
      },
    },
  ],
  orders: [
    {
      orderId: { type: String, required: true, index: true }, // Index for orderId for faster lookups
      orderName: { type: String, required: true },
      name: { type: String, required: true },
      role: { type: String, required: true },
      quantity: { type: Number, required: true },
      value: { type: Number, required: true },
      date: { type: Date, required: true },
    },
  ],
  callFrequency: { type: String, enum: ['Daily', 'Weekly'], default: null },
  lastCall: { type: Date, index: true }, // Index for lastCall to optimize recent call queries
  keyAccountManagers: {
    kamId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'KAM', 
      required: true, 
      index: true // Index for KAM ID to improve lookups
    },
    fullName: { type: String, required: true },
    assignedDate: { type: Date, required: true, default: Date.now },
  }
});

// Compound Index for frequently queried fields
leadSchema.index({ leadStatus: 1, lastCall: -1 });

module.exports = mongoose.model('Lead', leadSchema);
