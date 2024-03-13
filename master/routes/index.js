import userRouter from './user.js';
import projectRouter from './project.js';
import fetchCodeRouter from './code.js';

export default (app) => {
    app.use('/user', userRouter);
    app.use('/project', projectRouter);
    app.use('/fetch-code', fetchCodeRouter);
}