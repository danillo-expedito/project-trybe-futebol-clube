import { Request, Response, Router } from 'express';
import MatchController from '../controller/MatchController';
import Validations from '../middlewares/Validations';

const matchController = new MatchController();

const router = Router();

router.get('/', (req: Request, res: Response) => matchController.findAllMatches(req, res));
router.patch(
  '/:id/finish',
  Validations.validateToken,
  (req: Request, res: Response) => matchController.finishMatch(req, res),
);
export default router;
