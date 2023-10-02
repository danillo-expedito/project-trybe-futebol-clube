import { Secret, SignOptions, sign, verify } from 'jsonwebtoken';
import { IPayload } from '../Interfaces/IPayload';

export default class JWT {
  private static secret: Secret = process.env.JWT_SECRET || 'jwt_secret';

  private static jwtConfig: SignOptions = {
    expiresIn: '5d',
    algorithm: 'HS256',
  };

  public static sign(payload: IPayload): string {
    return sign({ ...payload }, this.secret, this.jwtConfig);
  }

  public static verify(token: string): IPayload | string {
    try {
      return verify(token, this.secret) as IPayload;
    } catch (error) {
      return 'Token must be a valid token';
    }
  }
}
