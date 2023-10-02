import IMatch from './IMatch';

export default interface IMatchModel {
  findAll(filter?: boolean): Promise<IMatch[]>;
//   findById(id: number): Promise<IMatch | null>;
//   create(match: IMatch): Promise<IMatch>;
//   update(match: IMatch): Promise<IMatch>;
//   delete(id: number): Promise<boolean>;
}
