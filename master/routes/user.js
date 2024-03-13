import express from 'express';
import { fetchUser,createUser } from '../controller/user.js';

const router = express.Router();

router.get('/:userId', fetchUser);
router.post('/', createUser);

export default router;