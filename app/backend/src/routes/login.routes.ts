import { Request, Response, Router } from 'express';
import LoginController from '../controller/LoginController';
// import Auth from '../middlewares/auth.middleware';
// import { IPayload } from '../Interfaces/IPayload';

const loginController = new LoginController();
const router = Router();

router.post('/', (req: Request, res: Response) => loginController.login(req, res));
// router.get('/role', Auth.authenticate, (req: Request, res: Response) => {
//   const { role } = req.user as IPayload;

//   res.status(200).json({ role });
// });

export default router;
