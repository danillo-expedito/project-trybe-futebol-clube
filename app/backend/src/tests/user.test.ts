import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import UserMock from './mocks/User.mock';
import { app } from '../app';
import SequelizeUser from '../database/models/SequelizeUser'

chai.use(chaiHttp);

const { expect } = chai;

describe('Login Test', function () {
    it('if does not receive an email, should return a 400 error', async function () {
        const { status, body } = await chai.request(app).post('/login')
        .send(UserMock.userBodyWithoutEmail);

        expect(status).to.be.equal(400);
        expect(body).to.be.deep.equal({
            message: 'All fields must be filled',
        });
    });
    it('if does not receive a password, should return a 400 error', async function () {
        const { status, body } = await chai.request(app).
        post('/login').send(UserMock.userBodyWithoutPassword);

        expect(status).to.be.equal(400);
        expect(body).to.be.deep.equal({
            message: 'All fields must be filled',
        });
    });
    it('if receives an invalid email, should return a 401 error', async function () {
        const { status, body } = await chai.request(app).
        post('/login').send(UserMock.userBodyWithInvalidEmail);

        expect(status).to.be.equal(401);
        expect(body).to.be.deep.equal({
            message: 'Invalid email or password',
        });
    });
    it('if receives an invalid password, should return a 401 error', async function () {
        const { status, body } = await chai.request(app).
        post('/login').send(UserMock.userBodyWithInvalidPassword);

        expect(status).to.be.equal(401);
        expect(body).to.be.deep.equal({
            message: 'Invalid email or password',
        });
    });
    it('if receives an invalid format email, should return a 401 error', async function () {
        const { status, body } = await chai.request(app).
        post('/login').send({
            email: '@admin.com',
            password: '12345',
        });

        expect(status).to.be.equal(401);
        expect(body).to.be.deep.equal({
            message: 'Invalid email or password',
        });
    });
    it('if receives an invalid format password, should return a 401 error', async function () {
        const { status, body } = await chai.request(app).
        post('/login').send({
            email: UserMock.validEmail,
            password: '12345',
        });

        expect(status).to.be.equal(401);
        expect(body).to.be.deep.equal({
            message: 'Invalid email or password',
        });
    });
    it('if receives a valid email and password, should return a 200 status', async function () {
        sinon.stub(SequelizeUser, 'findOne').resolves(UserMock.user as any);

        const { status, body } = await chai.request(app).
        post('/login').send(UserMock.validUserBody);

        expect(status).to.be.equal(200);
        expect(body).to.have.property('token');
    });
})