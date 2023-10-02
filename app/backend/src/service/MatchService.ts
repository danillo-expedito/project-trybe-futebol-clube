import MatchModel from '../models/MatchModel';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import IMatch from '../Interfaces/Match/IMatch';

export default class MatchService {
  constructor(private matchModel: MatchModel = new MatchModel()) {}

  public async findAll(filter?: boolean): Promise<ServiceResponse<IMatch[]>> {
    const matches = await this.matchModel.findAll(filter);
    return { status: 'SUCCESSFUL', data: matches };
  }

  public async finishMatch(id: number): Promise<ServiceResponse<IMatch>> {
    const match = await this.matchModel.finishMatch(id);
    if (!match) return { status: 'NOT_FOUND', data: { message: 'Match not found' } };

    return { status: 'SUCCESSFUL', data: match };
  }
}
