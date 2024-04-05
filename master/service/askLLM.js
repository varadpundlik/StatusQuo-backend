const axios = require('axios');

const askLLM = async (prompt) => {
    try{
        console.log("AskLLM")
        console.log(prompt);
        const response = await axios.get(`http://localhost:6000/query/?query=${prompt}`);
        console.log(response.data)
        return response.data;
    }catch(error){
        console.log(error.message);
        return error.message;
    }
}

module.exports= askLLM;