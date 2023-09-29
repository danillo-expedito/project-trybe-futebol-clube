// import * as sinon from 'sinon';
// import * as chai from 'chai';
// // @ts-ignore
// import chaiHttp = require('chai-http');

// import UserMock from './mocks/User.mock';
// import AuthMock from './mocks/Auth.mock';
// import { app } from '../app';
// import SequelizeUser from '../database/models/SequelizeUser'
// import jwtUtil from '../utils/jwt.util';

// chai.use(chaiHttp);

// const { expect } = chai;

// describe('Login Test Auth', function () {
//     it('if not receives an token, should return a 401 error', async function () {
//         const { status, body } = await chai.request(app).
//         post('/login').send(UserMock.userBodyWithInvalidEmail);

//         expect(status).to.be.equal(401);
//         expect(body).to.be.deep.equal({
//             message: 'Token not found',
//         });
//     });
//     it('if receives an invalid token, should return a 401 error', async function () {
//         const { status, body } = await chai.request(app).
//         post('/login').send(UserMock.userBodyWithInvalidEmail);

//         expect(status).to.be.equal(401);
//         expect(body).to.be.deep.equal({
//             message: 'Token not found',
//         });
//     });
// });