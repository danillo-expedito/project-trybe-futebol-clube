import * as bcrypt from 'bcryptjs';
import IUserModel from '../Interfaces/User/IUserModel';
import UserModel from '../models/UserModel';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import JWT from '../utils/jwt.util';
import { Token } from '../Interfaces/Token';
import { ILogin } from '../Interfaces/ILogin';

export default class LoginService {
  constructor(
    private userModel: IUserModel = new UserModel(),
    private jwtService = JWT,
  ) {}

  public async login(data: ILogin): Promise<ServiceResponse<Token>> {
    const user = await this.userModel.findByEmail(data.email);
    if (!user || !bcrypt.compareSync(data.password, user.password)) {
      return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };
    }

    const { email, role } = user;

    const token = this.jwtService.sign({ email, role });
    return { status: 'SUCCESSFUL', data: { token } };
  }
}
