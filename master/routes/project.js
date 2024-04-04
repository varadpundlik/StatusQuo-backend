const express = require('express');
const {fetchProject, createProject,fetchAllProject} =require('../controller/project');

const router = express.Router();

router.get('/getAll', fetchAllProject);
router.get('/:projectId', fetchProject);
router.post('/', createProject);

module.exports =router;