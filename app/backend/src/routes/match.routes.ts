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
router.patch(
  '/:id',
  Validations.validateToken,
  Validations.validateScore,
  (req: Request, res: Response) => matchController.updateMatch(req, res),
);
router.post(
  '/',
  Validations.validateToken,
  Validations.validateMatch,
  (req: Request, res: Response) => matchController.createMatch(req, res),
);
export default router;
