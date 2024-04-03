require('dotenv').config();

const config = {
    db_host: process.env.db_host  ||process.env.db_url,
    token:process.env.token 
};

module.exports = config;