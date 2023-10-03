import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import MatchesMock from './mocks/Matches.mock';
import { app } from '../app';
import SequelizeMatch from '../database/models/SequelizeMatch';
import Validations from '../middlewares/Validations';
import JWT from '../utils/jwt.util';
import Match from '../database/models/SequelizeMatch';

chai.use(chaiHttp);

const { expect } = chai;

describe('Matches Test', function () {
    it('should return a list of matches', async function () {
        sinon.stub(SequelizeMatch, 'findAll').resolves(MatchesMock.allMatches as any);

        const { status, body } = await chai.request(app).get('/matches');

        expect(status).to.be.equal(200);
        expect(body).to.be.deep.equal(MatchesMock.allMatches);
    });
    it('should return a match', async function () {
        sinon.stub(SequelizeMatch, 'findByPk').resolves(MatchesMock.match as any);

        const { status, body } = await chai.request(app).get('/matches/5');

        expect(status).to.be.equal(200);
        expect(body).to.be.deep.equal(MatchesMock.match);
    });
    it('should update a match score', async function () {
        sinon.stub(SequelizeMatch, 'update').resolves([1] as any);
        sinon.stub(SequelizeMatch, 'findByPk').resolves(MatchesMock.match as any);
        sinon.stub(Validations, 'validateScore').returns();
        sinon.stub(JWT, 'verify').resolves();

        const { status, body } = await chai.request(app).put('/matches/5')
        .set('authorization', 'validToken').send(MatchesMock.newScore);

        expect(status).to.be.equal(200);
        expect(body.message).to.equal('Updated');
    });
    it('should return not found when the match to update doesnt exist', async function () {
        sinon.stub(SequelizeMatch, 'update').resolves([0] as any);
        sinon.stub(SequelizeMatch, 'findByPk').resolves(null as any);
        sinon.stub(Validations, 'validateScore').returns();
        sinon.stub(JWT, 'verify').resolves();

        const { status, body } = await chai.request(app).put('/matches/5')
        .set('authorization', 'validToken').send(MatchesMock.newScore);

        expect(status).to.be.equal(404);
        expect(body.message).to.equal('Match not found');
    });
    it('should finish a match', async function () {
        sinon.stub(SequelizeMatch, 'update').resolves([1] as any);
        sinon.stub(SequelizeMatch, 'findByPk').resolves(MatchesMock.match as any);
        sinon.stub(JWT, 'verify').resolves();

        const { status, body } = await chai.request(app).put('/matches/5/finish')
        .set('authorization', 'validToken');

        expect(status).to.be.equal(200);
        expect(body.message).to.equal('Finished');
    });
    it('should create a match', async function() {
        sinon.stub(SequelizeMatch, 'create').resolves(MatchesMock.newMatch as any);
        sinon.stub(Validations, 'validateMatch').returns();
        sinon.stub(JWT, 'verify').resolves();
    
      const { status, body } = await chai.request(app).post('/matches')
          .set('authorization', 'validToken')
          .send();
    
        expect(status).to.equal(201);
        expect(body).to.deep.equal(MatchesMock.newMatch);
      });
    
      it('shouldn\'t create a match without a token', async function() {
        const { status, body } = await chai.request(app).post('/matches');
    
        expect(status).to.equal(404);
        expect(body.message).to.equal('Token not found');
      });
    
      it('shouldn\'t create a match with an invalid token', async function() {
        const { status, body } = await chai.request(app).post('/matches')
          .set('authorization', 'invalidToken');
    
        expect(status).to.equal(401);
        expect(body.message).to.equal('Token must be a valid token');
      });
    
      it('shouldn\'t create a match with invalid body data', async function() {
        sinon.stub(JWT, 'verify').resolves();
    
        const { status, body } = await chai.request(app).post('/matches')
          .set('authorization', 'validToken')
          .send(MatchesMock.matchWithoutHomeTeamGoals);
    
        expect(status).to.equal(400);
        expect(body.message).to.equal('homeTeamGoals is required');
      });
    afterEach(function () {
        sinon.restore();
    });
});