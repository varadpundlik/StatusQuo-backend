const express = require('express');
const {fetchProject, createProject,fetchAllProject,getMyProjects} =require('../controller/project');

const router = express.Router();

router.get('/getAll', fetchAllProject);
router.get('/getMyProjects/:email', getMyProjects);
router.get('/:projectId', fetchProject);
router.post('/', createProject);

module.exports =router;