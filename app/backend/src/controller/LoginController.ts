import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import LoginService from '../service/LoginService';

export default class LoginController {
  constructor(private loginService: LoginService = new LoginService()) {}

  public async login(req: Request, res: Response) {
    const serviceResponse = await this.loginService.login(req.body);
    if (serviceResponse.status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
    }

    return res.status(200).json(serviceResponse.data);
  }
}
