import IMatch from '../Interfaces/Match/IMatch';
import IMatchModel from '../Interfaces/Match/IMatchModel';
import SequelizeMatch from '../database/models/SequelizeMatch';
import SequelizeTeam from '../database/models/SequelizeTeam';
import { NewEntity } from '../Interfaces';

export default class MatchModel implements IMatchModel {
  private model = SequelizeMatch;
  private teamModel = SequelizeTeam;

  async findAll(filter?: boolean): Promise<IMatch[]> {
    const matches = await this.model
      .findAll(
        { include:
            [{
              model: this.teamModel, as: 'homeTeam', attributes: ['teamName'] },
            { model: this.teamModel, as: 'awayTeam', attributes: ['teamName'] }] },
      );

    if (filter === undefined) {
      return matches.map((match) => match);
    }

    return matches.filter((match) => match.inProgress === filter);
  }

  async findById(id: number): Promise<IMatch | null> {
    const match = await this.model.findByPk(id);
    if (!match) return null;

    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals, inProgress }: IMatch = match;
    return { id, homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals, inProgress };
  }

  async finishMatch(id: number): Promise<IMatch | null> {
    const [affectedRows] = await this.model.update({ inProgress: false }, { where: { id } });
    if (affectedRows === 0) return null;

    const match = await this.findById(id);
    return match;
  }

  async update(id: IMatch['id'], score: Partial<NewEntity<IMatch>>): Promise<IMatch | null> {
    const [affectedRows] = await this.model.update(score, { where: { id } });
    if (affectedRows === 0) return null;

    const updatedMatch = await this.findById(id);
    return updatedMatch;
  }

  async create(match: NewEntity<IMatch>): Promise<IMatch> {
    const newMatch = await this.model.create({ ...match, inProgress: true });
    const { id, homeTeamId, awayTeamId,
      homeTeamGoals, awayTeamGoals, inProgress }: IMatch = newMatch;

    return { id, homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals, inProgress };
  }
}
