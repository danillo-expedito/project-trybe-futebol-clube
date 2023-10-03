import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import MatchService from '../service/MatchService';

export default class MatchController {
  constructor(private matchService: MatchService = new MatchService()) {}

  public async findAllMatches(req: Request, res: Response) {
    const { inProgress } = req.query;
    const filter = inProgress === 'true';
    const serviceResponse = await this.matchService
      .findAll(inProgress !== undefined ? filter as boolean : undefined);

    return res.status(200).json(serviceResponse.data);
  }

  public async finishMatch(req: Request, res: Response) {
    const { id } = req.params;
    const serviceResponse = await this.matchService.finishMatch(Number(id));

    if (serviceResponse.status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
    }

    return res.status(200).json({ message: 'Finished' });
  }

  public async updateMatch(req: Request, res: Response) {
    const { id } = req.params;
    const serviceResponse = await this.matchService.updateMatch(Number(id), req.body);

    if (serviceResponse.status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
    }

    return res.status(200).json(serviceResponse.data);
  }

  public async createMatch(req: Request, res: Response) {
    const serviceResponse = await this.matchService.createMatch(req.body);

    if (serviceResponse.status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
    }

    return res.status(201).json(serviceResponse.data);
  }
}
