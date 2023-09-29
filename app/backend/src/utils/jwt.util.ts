import * as jwt from 'jsonwebtoken';
import { IPayload } from '../Interfaces/IPayload';

const secret = process.env.JWT_SECRET || 'secret';

function sign(payload: IPayload): string {
  const token = jwt.sign(payload, secret);
  return token;
}

function verify(token: string): IPayload {
  const data = jwt.verify(token, secret) as IPayload;
  return data;
}

export default {
  sign,
  verify,
};
