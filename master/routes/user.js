const express = require('express');
const {fetchUser, createUser,fetchAllUsers} = require('../controller/user');

const router = express.Router();
router.get('/getall', fetchAllUsers);
router.get('/:userId', fetchUser);
router.post('/', createUser);

module.exports = router;