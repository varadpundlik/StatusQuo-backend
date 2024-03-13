import express from 'express';
import {fetchCurrentCode , fetchCommitWiseCode} from '../controller/fetchCode.js';

const router = express.Router();

router.get('/current', fetchCurrentCode);
router.get('/commit-wise', fetchCommitWiseCode);

export default router;