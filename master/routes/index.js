const userRouter = require('./user');
const projectRouter = require('./project');
const fetchCodeRouter = require('./code');
const statusRouter = require('./status');
const chatbotRouter = require('./chatbot');

module.exports = (app) => {
    app.use('/user', userRouter);
    app.use('/project', projectRouter);
    app.use('/status', statusRouter);
    app.use('/fetch-code', fetchCodeRouter);
    app.use('/chatbot', chatbotRouter);
}