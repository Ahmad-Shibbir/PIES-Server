const mongoose = require('mongoose');

// Define the item schema
const itemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  Borrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  itemType: {
    type: String,
    enum: ['home appliances', 'food', 'book'],
    required: true
  },
  availability: {
    type: Boolean,
    default: true
  },
  itemImg:{
    type: String,
    required: true
  },
  itemStat:{
    type: String,
    enum: ['available', 'requested', 'borrowd', 'item back'],
    required: true
  }
});

// Create and export the Item model
module.exports = mongoose.model('Item', itemSchema);

