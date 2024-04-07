require('dotenv').config();

const config = {
    db_host: process.env.db_host  ||process.env.db_url,
    token:process.env.token ,
    cloud_api_secret:process.env.cloud_api_secret ,
    cloud_api_key:process.env.cloud_api_key ,
    cloud_name:process.env.cloud_name ,

};

module.exports = config;