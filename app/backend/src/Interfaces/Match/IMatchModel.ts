import IMatch from './IMatch';
import IScore from './IScore';

export default interface IMatchModel {
  findAll(filter?: boolean): Promise<IMatch[]>;
  finishMatch(id: number): Promise<IMatch | null>;
  update(id: number, score: IScore): Promise<IMatch | null>;
  //   findById(id: number): Promise<IMatch | null>;
  //   create(match: IMatch): Promise<IMatch>;
//   delete(id: number): Promise<boolean>;
}
