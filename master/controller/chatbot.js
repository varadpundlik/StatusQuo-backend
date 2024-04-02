const axios = require('axios');
const Chatbot = require('../models/chatbot');
const document = require('../models/document');
const User = require('../models/user');

const chatbotQuery = async (ws, data) => {
  try {
    const query = data.query;

    const mlResponse = await axios.get(`http://127.0.0.1:8080/query/?query=${query}`);
    // console.log("__________");
    // console.log(mlResponse.data);
    // console.log("___________");
    
    const response = mlResponse.data.response; 
    // console.log("============");
    // console.log(response);
    // console.log("============");

    ws.send(JSON.stringify({ message: 'Query processed successfully', response }));
  } catch (e) {
    ws.send(JSON.stringify({ message: 'Error processing query', error: e.message }));
  }
};

const chatbotOutputResponse = async (ws, data) => {
  try {
    const { query, response } = data;
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
