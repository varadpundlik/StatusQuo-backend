const express = require('express');
const {fetchProject, createProject} =require('../controller/project');

const router = express.Router();

router.get('/:projectId', fetchProject);
router.post('/', createProject);

module.exports =router;