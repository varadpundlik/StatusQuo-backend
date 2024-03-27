const axios = require('axios');

const askLLM = async (prompt) => {
    const response = await axios.get(`http://localhost:8080/query=${prompt}`);
    return response.data;
}

module.exports= askLLM;