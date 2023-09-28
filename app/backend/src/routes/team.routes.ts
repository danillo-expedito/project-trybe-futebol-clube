import { Request, Response, Router } from 'express';
import TeamController from '../controller/TeamController';

const teamController = new TeamController();

const router = Router();

router.get('/', (req: Request, res: Response) => teamController.findAllTeams(req, res));

export default router;
