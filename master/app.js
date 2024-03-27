const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const routes = require('./routes');


const app = express();
app.use(express.json());
mongoose
  .connect(config.db_host)
  .catch((err) => {
    console.log(err);
  })
  .then(console.log("DB connected"));

app.get('/', (req, res) => {
    res.send('Hello World');
});
routes(app);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});




