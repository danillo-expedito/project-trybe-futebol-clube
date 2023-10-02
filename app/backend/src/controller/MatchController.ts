import { Request, Response } from 'express';
import MatchService from '../service/MatchService';

export default class MatchController {
  constructor(private matchService: MatchService = new MatchService()) {}

  public async findAllMatches(_req: Request, res: Response) {
    const matches = await this.matchService.findAll();

    return res.status(200).json(matches);
  }
}
