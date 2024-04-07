const axios = require('axios');

const apiUrl = 'http://127.0.0.1:6000/donwload_and_train/';

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
