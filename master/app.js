import express from 'express';
import routes from './routes/index.js';
import mongoose from 'mongoose';
import config from './config/index.js';

const app = express();
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




