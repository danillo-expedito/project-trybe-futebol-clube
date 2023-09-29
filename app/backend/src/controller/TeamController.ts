import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import TeamService from '../service/TeamService';

export default class TeamController {
  constructor(private teamService: TeamService = new TeamService()) {}

  public async findAllTeams(req: Request, res: Response) {
    const serviceResponse = await this.teamService.findAllTeams();
    return res.status(200).json(serviceResponse.data);
  }

  public async findTeamById(req: Request, res: Response) {
    const { id } = req.params;
    const serviceResponse = await this.teamService.findTeamById(Number(id));
    if (serviceResponse.status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
    }

    return res.status(200).json(serviceResponse.data);
  }
}
