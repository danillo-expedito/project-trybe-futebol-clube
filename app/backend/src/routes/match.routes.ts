import { Request, Response, Router } from 'express';
import MatchController from '../controller/MatchController';

const matchController = new MatchController();

const router = Router();

router.get('/', (req: Request, res: Response) => matchController.findAllMatches(req, res));

export default router;
