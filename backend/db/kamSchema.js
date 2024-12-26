
const mongoose = require('mongoose');

const kamSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },  // Store hashed passwords
  KAMS: [
    {
      fullName: { type: String, required: true },
      status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('KAM', kamSchema);
