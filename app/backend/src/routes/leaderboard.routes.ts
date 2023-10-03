import { Request, Response, Router } from 'express';
import TeamController from '../controller/TeamController';
// import Validations from '../middlewares/Validations';

const teamController = new TeamController();
const router = Router();

router.get(
  '/home',
  (req: Request, res: Response) => teamController.showLeaderboard(req, res),
);

router.get(
  '/away',
  (req: Request, res: Response) => teamController.showLeaderboard(req, res),
);

export default router;
