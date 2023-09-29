import IUser from './IUser';

export default interface IUserModel {
  login(email: string, password: string): Promise<IUser | null>;
}
