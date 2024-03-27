const userRouter = require('./user');
const projectRouter = require('./project');
const fetchCodeRouter = require('./code');

module.exports = (app) => {
    app.use('/user', userRouter);
    app.use('/project', projectRouter);
    app.use('/fetch-code', fetchCodeRouter);
}