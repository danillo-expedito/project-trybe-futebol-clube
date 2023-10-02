import { Request, Response } from 'express';
import MatchService from '../service/MatchService';

export default class MatchController {
  constructor(private matchService: MatchService = new MatchService()) {}

  public async findAllMatches(req: Request, res: Response) {
    if (req.query.inProgress === undefined) {
      const matches = await this.matchService.findAll();

      return res.status(200).json(matches);
    }
    const { inProgress } = req.query;
    const filter = inProgress === 'true';
    const matches = await this.matchService.findAll(filter);

    return res.status(200).json(matches);
  }
}
