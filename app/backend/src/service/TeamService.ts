import ITeam from '../Interfaces/Team/ITeam';
import { ITeamModel } from '../Interfaces/Team/ITeamModel';
import TeamModel from '../models/TeamModel';
import { ServiceResponse } from '../Interfaces/ServiceResponse';

export default class TeamService {
  constructor(private teamModel: ITeamModel = new TeamModel()) {}

  public async findAllTeams(): Promise<ServiceResponse<ITeam[]>> {
    const teams = await this.teamModel.findAll();
    return { status: 'SUCCESSFUL', data: teams };
  }
}
