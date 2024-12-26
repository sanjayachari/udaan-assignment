const mongoose = require('mongoose');


const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  leadStatus: { type: String, required: true, enum: ['New', 'In Progress', 'Converted'] },
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
      date: { type: Date, required: true },
      summary: { type: String, required: true },
      outcome: { type: String, required: true },
    },
  ],
  orders: [
    {
      orderId: { type: String, required: true },
      quantity: { type: Number, required: true },
      value: { type: Number, required: true },
      date: { type: Date, required: true },
    },
  ],
  callFrequency: { type: String, enum: ['Daily', 'Weekly', 'Monthly'], default: null },
  lastCall: { type: Date },
  keyAccountManagers: 
    {
      kamId: { type: mongoose.Schema.Types.ObjectId, ref: 'KAM', required: true },  // Reference to KAM schema
      fullName: { type: String, required: true },
      assignedDate: { type: Date, required: true, default: Date.now },
    }
  
});


module.exports = mongoose.model('Lead', leadSchema);

