const userRouter = require('./user');
const projectRouter = require('./project');
const fetchCodeRouter = require('./code');
const statusRouter = require('./status');
const chatbotRouter = require('./chatbot');
const documentRouter = require('./document');
const pullRequestRouter = require('./pull_request');
const issueRouter = require('./issue');

module.exports = (app) => {
    app.use('/user', userRouter);
    app.use('/project', projectRouter);
    app.use('/status', statusRouter);
    app.use('/fetch-code', fetchCodeRouter);
    app.use('/chatbot', chatbotRouter);
    app.use('/document', documentRouter);
    app.use('/pull-request', pullRequestRouter);
    app.use('/issue', issueRouter);
}