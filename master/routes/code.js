import express from 'express';
import {fetchCurrentCode , fetchCommitWiseCode} from '../controller/fetchCode.js';

const router = express.Router();

router.get('/current/:projectId', fetchCurrentCode);
router.get('/commit-wise/:projectId', fetchCommitWiseCode);

export default router;