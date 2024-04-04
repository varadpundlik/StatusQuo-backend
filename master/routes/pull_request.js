const express = require("express");
const listenForPullRequests = require("../controller/pull_request");

const pullRequestRouter = express.Router();

pullRequestRouter.get("/review/:id", listenForPullRequests);

module.exports = pullRequestRouter;