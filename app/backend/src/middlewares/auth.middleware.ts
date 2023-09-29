import { NextFunction, Request, Response } from 'express';
import jwtUtil from '../utils/jwt.util';
import UserModel from '../models/UserModel';
import IUserModel from '../Interfaces/User/IUserModel';

class Auth {
  constructor(private userModel: IUserModel = new UserModel()) {}

  public async authenticate(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ message: 'Token not found' });
    }

    const decoded = await jwtUtil.verify(authorization);
    const user = await this.userModel.findByEmail(decoded.email);

    if (!user) {
      return res.status(401).json({ message: 'Token must be a valid token' });
    }

    const { id, email, role } = user;
    req.user = { id, email, role };

    next();
  }
}

export default new Auth();
