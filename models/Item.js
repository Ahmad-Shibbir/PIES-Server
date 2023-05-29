const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  borrowCount: {
    type: Number,
    default: 0
  },
  borrowed: {
    type: Boolean,
    default: false
  },
 
});

module.exports = mongoose.model('Item', itemSchema);
