import * as bcrypt from 'bcryptjs';
import IUserModel from '../Interfaces/User/IUserModel';
import UserModel from '../models/UserModel';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import jwtUtil from '../utils/jwt.util';
import { Token } from '../Interfaces/Token';

export default class LoginService {
  constructor(private userModel: IUserModel = new UserModel()) {}

  private static validateEmail(email: string): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  private static validatePassword(password: string): boolean {
    return password.length >= 6;
  }

  public async login(email: string, password: string): Promise<ServiceResponse<Token>> {
    if (!email || !password) {
      return { status: 'INVALID_DATA', data: { message: 'All fields must be filled' } };
    }

    const isEmailValid = LoginService.validateEmail(email);
    const isPasswordValid = LoginService.validatePassword(password);

    const user = await this.userModel.findByEmail(email);
    if (!user || !bcrypt.compareSync(password, user.password)
    || !isEmailValid || !isPasswordValid) {
      return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };
    }

    const { id } = user;

    const token = jwtUtil.sign({ id, email });
    return { status: 'SUCCESSFUL', data: { token } };
  }
}
