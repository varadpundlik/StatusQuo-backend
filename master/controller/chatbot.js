const axios = require('axios');
const Chatbot = require('../models/chatbot');
const document = require('../models/document');
const User = require('../models/user');
const askLLM = require('../service/askLLM');

const chatbotQuery = async (ws, data) => {
  try {
    const query = data.query;
    console.log(query);
    const mlResponse = await askLLM(query);
    
    const response = mlResponse.response; 
    console.log(response);

    ws.send(JSON.stringify({ message: 'Query processed successfully', response }));
  } catch (e) {
    ws.send(JSON.stringify({ message: 'Error processing query', error: e.message }));
  }
};

const chatbotOutputResponse = async (ws, data) => {
  try {
    const { query, response } = data;

    // Assuming you have a User model and a userId is attached to the WebSocket
    const user = await User.findOne({ _id: ws.userId });

    if (!user) {
      ws.send(JSON.stringify({ message: 'User not found' }));
      return;
    }

    const chatbot = new Chatbot({
      query,
      response,
      user: user.userId,
    });

    await chatbot.save();

    ws.send(JSON.stringify({ message: 'Chatbot response saved successfully' }));
  } catch (e) {
    ws.send(JSON.stringify({ message: 'Error saving chatbot response', error: e.message }));
  }
};

const saveToDocument = async (ws, data) => {
  try {
    const doc = await Document.findOne({ user: ws.userId }).sort({ _id: -1 }).exec();

    if (!doc) {
      ws.send(JSON.stringify({ message: 'User not found' }));
      return;
    }

    doc.document_content += '\n' + data;

    await doc.save();

    ws.send(JSON.stringify({ message: 'Last response added in document successfully' }));
  } catch (e) {
    ws.send(JSON.stringify({ message: 'Error adding in document', error: e.message }));
  }
};

module.exports = { chatbotQuery, chatbotOutputResponse, saveToDocument };
