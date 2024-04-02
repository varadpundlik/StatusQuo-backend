const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  document_content: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const document = mongoose.model('document', documentSchema);

module.exports = document;
