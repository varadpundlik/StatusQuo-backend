const express = require('express');
const {getStatus} = require('../controller/status');

const router = express.Router();

router.get('/:projectId', getStatus);

module.exports = router;