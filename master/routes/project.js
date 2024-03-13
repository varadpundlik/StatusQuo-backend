import express from 'express';
import { fetchProject,createProject } from '../controller/project.js';

const router = express.Router();

router.get('/:projectId', fetchProject);
router.post('/', createProject);

export default router;