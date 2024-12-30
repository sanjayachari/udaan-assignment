const mongoose = require('mongoose');

const kamSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true // Index for email to optimize lookups
  },
  password: { 
    type: String, 
    required: true 
  }, // Store hashed passwords
  KAMS: [
    {
      fullName: { 
        type: String, 
        required: true, 
        index: true // Index for fullName for faster searches within the nested array
      },
      status: { 
        type: String, 
        enum: ['Active', 'Inactive'], 
        default: 'Active', 
        index: true // Index for status to filter Active/Inactive KAMs
      },
      createdAt: { 
        type: Date, 
        default: Date.now,
        index: true // Index for createdAt for sorting by creation time
      }
    }
  ]
}, { timestamps: true });

// Add compound index for frequently queried fields in nested KAMS array
kamSchema.index({ 'KAMS.fullName': 1, 'KAMS.status': 1 });

// Export the model
module.exports = mongoose.model('KAM', kamSchema);
