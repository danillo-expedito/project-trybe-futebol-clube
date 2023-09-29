import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import TeamMock from './mocks/Team.mock';
import { app } from '../app';
import SequelizeTeam from '../database/models/SequelizeTeam';

chai.use(chaiHttp);

const { expect } = chai;

describe('Teams Test', function () {
    it('should return a list of teams', async function () {
        sinon.stub(SequelizeTeam, 'findAll').resolves(TeamMock.teams as any);

        const { status, body } = await chai.request(app).get('/teams');

        expect(status).to.be.equal(200);
        expect(body).to.be.deep.equal(TeamMock.teams);
    });
    it('should return a team', async function () {
        sinon.stub(SequelizeTeam, 'findByPk').resolves(TeamMock.team as any);

        const { status, body } = await chai.request(app).get('/teams/5');

        expect(status).to.be.equal(200);
        expect(body).to.be.deep.equal(TeamMock.team);
    });
    it('Should return a 404 error if the id is not found', async function () {
        sinon.stub(SequelizeTeam, 'findByPk').resolves(null);

        const { status, body } = await chai.request(app).get('/teams/6');

        expect(status).to.be.equal(404);
        expect(body).to.be.deep.equal({
            message: 'Team not found',
        });
    });
    
    afterEach(function () {
        sinon.restore();
    });
})
