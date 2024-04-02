const express = require('express');
const expressWs = require('express-ws');

const app = express();
expressWs(app);

const router = express.Router();
const chatbotController = require('../controller/chatbot');

router.ws('/chatbot-query', (ws, req) => {
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      await chatbotController.chatbotQuery(ws, data);
    } catch (e) {
      ws.send(JSON.stringify({ message: 'Error processing query', error: e.message }));
    }
  });

  ws.on('close', () => {
    console.log('Connection closed for /chatbot-query');
  });
});

router.ws('/chatbot-response', (ws, req) => {
  ws.userId = req.query.userId; 
  
  ws.on('message', async (message) => {
    const data = JSON.parse(message);
    await chatbotController.chatbotOutputResponse(ws, data);
  });

  ws.on('close', () => {
    console.log('Connection closed for /chatbot-response');
  });
});
router.ws('/create_doc', (ws, req) => {
  ws.userId = req.query.userId; 
  
  ws.on('message', async (message) => {
    const data = JSON.parse(message);
    await chatbotController.saveToDocument(ws, data);
  });

  ws.on('close', () => {
    console.log('Connection closed for /chatbot-response');
  });
});

module.exports = router;
