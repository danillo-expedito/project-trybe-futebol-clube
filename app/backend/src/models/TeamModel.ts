import { ITeamModel } from '../Interfaces/Team/ITeamModel';
import ITeam from '../Interfaces/Team/ITeam';
import SequelizeTeam from '../database/models/SequelizeTeam';

export default class TeamModel implements ITeamModel {
  private model = SequelizeTeam;

  async findAll(): Promise<ITeam[]> {
    const teams = await this.model.findAll();

    return teams.map((team) => ({
      id: team.id,
      teamName: team.teamName,
    }));
  }

  async findById(id: number): Promise<ITeam | null> {
    const team = await this.model.findByPk(id);
    if (!team) return null;

    return { id: team.id, teamName: team.teamName };
  }
}
