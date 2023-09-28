import { Router } from 'express';
import teamRouter from './team.routes';

const router = Router();

router.use('/team', teamRouter);

export default router;
