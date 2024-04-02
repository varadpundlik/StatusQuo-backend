const axios = require('axios');

const askLLM = async (prompt) => {
    try{
        const response = await axios.get(`http://localhost:6000/query/?query=${prompt}`);
        return response.data;
    }catch(error){
        console.log(error.message);
        return error.message;
    }
}

module.exports= askLLM;