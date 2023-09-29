import { IPayload } from '../Interfaces/IPayload';
// Extend the Request interface
declare module 'express' {
  interface Request {
    user?: IPayload; // Assuming IUser is the type for your user object
  }
}
