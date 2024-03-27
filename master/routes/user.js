const express = require('express');
const {fetchUser, createUser} = require('../controller/user');

const router = express.Router();

router.get('/:userId', fetchUser);
router.post('/', createUser);

module.exports = router;