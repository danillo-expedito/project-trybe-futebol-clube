import IUser from './IUser';

export default interface IUserModel {
  findByEmail(userEmail: string): Promise<IUser | null>;
}
