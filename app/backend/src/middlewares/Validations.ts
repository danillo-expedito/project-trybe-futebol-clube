import { NextFunction, Request, Response } from 'express';
import { IPayload } from '../Interfaces/IPayload';
import JWT from '../utils/jwt.util';
// import TeamModel from '../models/TeamModel';

class Validations {
  static validateLogin(req: Request, res: Response, next: NextFunction): Response | void {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (password.length < 6) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    next();
  }

  static async validateToken(req: Request, res: Response, next: NextFunction):
  Promise<Response | void> {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: 'Token not found' });
    }

    const token = authorization?.replace('Bearer ', '') as string;
    const validToken = await JWT.verify(token);
    if (validToken === 'Token must be a valid token') {
      return res.status(401).json({ message: validToken });
    }

    req.body.user = validToken as IPayload;
    next();
  }

  static validateScore(req: Request, res: Response, next: NextFunction): Response | void {
    const score = req.body;
    const requiredKeys = ['homeTeamGoals', 'awayTeamGoals'];
    const notFoundKeys = requiredKeys.find((key) => !Object.keys(score).includes(key));
    if (notFoundKeys) {
      return res.status(400).json({ message: `${notFoundKeys} is required` });
    }

    next();
  }

  static validateMatch(req: Request, res: Response, next: NextFunction): Response | void {
    const match = req.body;
    const requiredKeys = ['homeTeamId', 'awayTeamId', 'homeTeamGoals', 'awayTeamGoals'];
    const notFoundKeys = requiredKeys.find((key) => !Object.keys(match).includes(key));
    if (notFoundKeys) {
      return res.status(400).json({ message: `${notFoundKeys} is required` });
    }
    // const { homeTeamId, awayTeamId } = match;
    // const homeTeamExists = new TeamModel().findById(Number(homeTeamId));
    // const awayTeamExists = new TeamModel().findById(Number(awayTeamId));
    // if (!homeTeamExists || !awayTeamExists) {
    //   return res.status(404).json({ message: 'There is no team with such id!' });
    // }

    next();
  }

  static validateTeams(req: Request, res: Response, next: NextFunction): Response | void {
    const { homeTeamId, awayTeamId } = req.body;
    if (homeTeamId === awayTeamId) {
      return res.status(422)
        .json({ message: 'It is not possible to create a match with two equal teams' });
    }

    next();
  }
}

export default Validations;
