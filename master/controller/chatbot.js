const axios = require('axios');
const Chatbot = require('../models/chatbot');
const User = require('../models/user');

exports.chatbotQuery = async (ws, data) => {
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

exports.chatbotOutputResponse = async (ws, data) => {
  try {
    const { query, response } = data;
    // console.log("--------------");
    // console.log(ws.userId);
    
    const user = await User.findOne({ _id: ws.userId });

    if (!user) {
      ws.send(JSON.stringify({ message: 'User not found' }));
      return;
    }
    // console.log(user);

    const chatbot = new Chatbot({
      query,
      response,
      user: user._id,
    });

    await chatbot.save();

    ws.send(JSON.stringify({ message: 'Chatbot response saved successfully' }));
  } catch (e) {
    ws.send(JSON.stringify({ message: 'Error saving chatbot response', error: e.message }));
  }
};
