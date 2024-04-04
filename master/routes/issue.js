const express = require("express");

const {fetchIssues} = require("../controller/issue");

const issueRouter = express.Router();

issueRouter.get("/suggest/:id", fetchIssues);

module.exports = issueRouter;