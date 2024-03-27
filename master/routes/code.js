const express = require('express');
const {fetchCommitWiseCode, fetchCurrentCode} = require('../controller/fetchCode');

const router = express.Router();

router.get('/current/:projectId', fetchCurrentCode);
router.get('/commit-wise/:projectId', fetchCommitWiseCode);

module.exports = router;