import IUserModel from '../Interfaces/User/IUserModel';
import IUser from '../Interfaces/User/IUser';
import SequelizeUser from '../database/models/SequelizeUser';

export default class UserModel implements IUserModel {
  private model = SequelizeUser;

  public async findByEmail(userEmail: string): Promise<IUser | null> {
    const user = await this.model.findOne({ where: { email: userEmail } });
    if (!user) return null;

    const { id, username, role, email, password } = user;
    return { id, username, role, email, password };
  }
}
