import IMatch from './IMatch';

export default interface IMatchModel {
  findAll(filter?: boolean): Promise<IMatch[]>;
  finishMatch(id: number): Promise<IMatch>;
  //   findById(id: number): Promise<IMatch | null>;
  //   create(match: IMatch): Promise<IMatch>;
  // update(id: IMatch['id']): Promise<IMatch>;
//   delete(id: number): Promise<boolean>;
}
