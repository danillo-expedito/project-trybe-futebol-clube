import MatchModel from '../models/MatchModel';
import { ServiceResponse, ServiceMessage } from '../Interfaces/ServiceResponse';
import IMatch from '../Interfaces/Match/IMatch';
import IScore from '../Interfaces/Match/IScore';

export default class MatchService {
  constructor(private matchModel: MatchModel = new MatchModel()) {}

  public async findAll(filter?: boolean): Promise<ServiceResponse<IMatch[]>> {
    const matches = await this.matchModel.findAll(filter);
    return { status: 'SUCCESSFUL', data: matches };
  }

  public async finishMatch(id: number): Promise<ServiceResponse<IMatch>> {
    const match = await this.matchModel.finishMatch(id);
    if (!match) {
      return { status: 'NOT_FOUND', data: { message: 'Match not found' } };
    }

    return { status: 'SUCCESSFUL', data: match as IMatch };
  }

  public async updateMatch(id: number, scoreUpdate: IScore):
  Promise<ServiceResponse<ServiceMessage>> {
    const match = await this.matchModel.update(id, scoreUpdate);
    if (!match) return { status: 'NOT_FOUND', data: { message: 'Match not found' } };

    return { status: 'SUCCESSFUL', data: { message: 'Updated' } };
  }

  public async createMatch(match: IMatch): Promise<ServiceResponse<IMatch>> {
    const newMatch = await this.matchModel.create(match);
    return { status: 'SUCCESSFUL', data: newMatch };
  }
}
