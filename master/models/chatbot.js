const mongoose = require('mongoose');

const chatbotSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Chatbot = mongoose.model('Chatbot', chatbotSchema);

module.exports = Chatbot;
