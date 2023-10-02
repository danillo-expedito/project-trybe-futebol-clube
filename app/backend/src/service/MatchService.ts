import MatchModel from '../models/MatchModel';

export default class MatchService {
  constructor(private matchModel: MatchModel = new MatchModel()) {}

  public async findAll() {
    const matches = await this.matchModel.findAll();

    return matches;
  }
}
