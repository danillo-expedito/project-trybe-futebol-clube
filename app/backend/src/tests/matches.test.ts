import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import MatchesMock from './mocks/Matches.mock';
import { app } from '../app';
import SequelizeMatch from '../database/models/SequelizeMatch';

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
});