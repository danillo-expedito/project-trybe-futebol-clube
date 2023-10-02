// import IMatch from 'src/Interfaces/Match/IMatch';
import IMatchModel from '../Interfaces/Match/IMatchModel';
import SequelizeMatch from '../database/models/SequelizeMatch';
import SequelizeTeam from '../database/models/SequelizeTeam';

export default class MatchModel implements IMatchModel {
  private model = SequelizeMatch;
  private teamModel = SequelizeTeam;

  async findAll(filter?: boolean) {
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

  async finishMatch(id: number) {
    const match = await this.model.findByPk(id);
    if (!match) {
      throw new Error('Match not found');
    }

    const updatedMatch = await match.update({ inProgress: !match.inProgress });
    return updatedMatch;
  }
}
