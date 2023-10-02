import MatchModel from '../models/MatchModel';

export default class MatchService {
  constructor(private matchModel: MatchModel = new MatchModel()) {}

  public async findAll(filter?: boolean) {
    if (filter === undefined) {
      const matches = await this.matchModel.findAll();

      return matches;
    }
    const matches = await this.matchModel.findAll(filter);
    return matches;
  }
}
