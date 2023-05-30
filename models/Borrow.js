const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'User',
    required: true
    // type: String,
    // required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'User',
    required: true
  },
  borrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemImg:{
    type: String,
    required: true
  },
  itemStat:{
    type: String,
    enum: ['available', 'requested', 'borrowed', 'item back'],
    required: true,
    // default: 'available'
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
