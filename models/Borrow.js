const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema({
  borrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  borrowedAt: {
    type: Date,
    default: Date.now
  },
  returnedAt: {
    type: Date
  }
  // Add other fields specific to your borrow
});

module.exports = mongoose.model('Borrow', borrowSchema);
