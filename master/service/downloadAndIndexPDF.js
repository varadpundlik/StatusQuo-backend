const axios = require('axios');

const apiUrl = 'https://statusquo-fastapi.onrender.com/donwload_and_train/';

async function downloadAndIndexPDF(url, name) {
    try {
        const data = {
            url: url,
            name: name
        };

        const response = await axios.post(apiUrl, data, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        

        console.log(response.data);
        return response ;
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}
module.exports = {
    downloadAndIndexPDF
};
