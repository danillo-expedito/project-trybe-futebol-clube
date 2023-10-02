// import IMatch from 'src/Interfaces/Match/IMatch';
import IMatchModel from '../Interfaces/Match/IMatchModel';
import SequelizeMatch from '../database/models/SequelizeMatch';
import SequelizeTeam from '../database/models/SequelizeTeam';

export default class MatchModel implements IMatchModel {
  private model = SequelizeMatch;
  private teamModel = SequelizeTeam;

  async findAll() {
    const matches = await this.model
      .findAll(
        { include:
            [{
              model: this.teamModel, as: 'homeTeam', attributes: ['teamName'] },
            { model: this.teamModel, as: 'awayTeam', attributes: ['teamName'] }] },
      );

    return matches;
  }
}
