require('dotenv').config();

const config = {
    db_host: process.env.db_host || 'mongodb://localhost:27017/statusQuoDB',
    token: process.env.toke,
};

module.exports = config;