import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import MatchModel from '../database/models/MatchModel';
import generateToken from '../utils/Jwt';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes de integração da rota /matches', () => {

  afterEach(() => sinon.restore());

  it('Verifica se retorna as informações de todas as partidas', async () => {
    const mockMatches = [
      {
        id: 1,
        homeTeamId: 16,
        homeTeamGoals: 1,
        awayTeamId: 8,
        awayTeamGoals: 1,
        inProgress: false,
      },
    ] as MatchModel[];

    sinon.stub(MatchModel, 'findAll').resolves(mockMatches);

    const response = await chai.request(app).get('/matches');

    expect(response.status).to.be.equal(200);
    expect(response.body).to.be.deep.equal(mockMatches);
  });

  it('Verifica se retorna as partidas em andamento', async () => {
    const mockRequest = { req: { query: { inProgress: 'true' } } };
    const mockResponse = [
      {
        id: 1,
        homeTeamId: 16,
        homeTeamGoals: 1,
        awayTeamId: 8,
        awayTeamGoals: 1,
        inProgress: true,
      },
    ] as MatchModel[];

    sinon.stub(MatchModel, 'findAll').resolves(mockResponse);

    const response = await chai.request(app)
      .get('/matches')
      .query({ inProgress: 'true' })
      .send(mockRequest);

    expect(response.status).to.be.equal(200);
    expect(response.body).to.be.deep.equal(mockResponse);
  });

  it('Mensagem de erro, caso token não seja passado...', async () => {
    const mockLogin = { req: { headers: { authorization: undefined } } };
    const response = await chai.request(app).patch('/matches/:id/finish').send(mockLogin);
    expect(response.status).to.be.equal(401);
    expect(response.body).to.be.deep.equal({ message: 'Token not found' });
  });

  it('É possível finalizar uma partida com as informações válidas...', async () => {
    const token = generateToken({ id: 1, role: 'user' });
    const mockRequest = { req: { params: { id: 1 } }, headers: { authorization: `${token}` } };

    sinon.stub(MatchModel, 'update').resolves();

    const response = await chai.request(app)
      .patch('/matches/:id/finish')
      .set({authorization: token})
      .send(mockRequest);

    expect(response.status).to.be.equal(200);
    expect(response.body).to.be.deep.equal('Finished');
  });

  it('Mensagem de erro para token inválido...', async () => {
    const token = generateToken({ id: 5, role: 'user' });
    const mockLoginUser = { req: { headers: { authorization: `${token}5` } } };
    const response = await chai.request(app)
      .patch('/matches/:id/finish')
      .set({authorization: 'aa' })
      .send(mockLoginUser);

    expect(response.status).to.be.equal(401);
  });

  it('É possível atualizar uma partida em andamento', async () => {
    const token = generateToken({ id: 10, role: 'user' });
    const mockPayload = { homeTeamGoals: 3, awayTeamGoals: 1 };
    const mockRequest = { req: { headers: { authorization: token }, params: { id: 2 }, body: mockPayload } };

    sinon.stub(MatchModel, 'update').resolves();

    const response = await chai.request(app)
      .patch('/matches/:id')
      .set({ authorization: token })
      .send(mockRequest.req.body);

    expect(response.status).to.be.equal(200);
    expect(response.body).to.be.deep.equal({ ...mockPayload });
  });

  it('Não é possível atualizar partidas com token inválido', async () => {
    const response = await chai.request(app)
      .patch('/matches/:id')
      .set({ authorization: 'asds' })
      .send();

    expect(response.status).to.be.equal(401);
  });

  it('Não é possível atualizar partidas sem token', async () => {
    const response = await chai.request(app)
      .patch('/matches/:id')
      .set({ authorization: '' })
      .send();

    expect(response.status).to.be.equal(401);
  });

  it('É possível criar uma partida com todas as informações corretas...', async () => {
    const token = generateToken({ id: 12, role: 'user' });
    const mockInput = { homeTeamId: 1, awayTeamId: 2, homeTeamGoals: 0, awayTeamGoals: 3 };
    const mockOutPut = { id: 50, ...mockInput, inProgress: true } as MatchModel;

    sinon.stub(MatchModel, 'create').resolves(mockOutPut);

    const response = await chai.request(app)
      .post('/matches')
      .set({ authorization: token })
      .send(mockInput);

    expect(response.status).to.be.equal(201);
    expect(response.body).to.be.deep.equal(mockOutPut);
  });

  it('Mensagem de erro, quando token inválido... (criar partidas)', async () => {
    const response = await chai.request(app)
      .post('/matches')
      .set({ authorization: 'asds' })
      .send();

    expect(response.status).to.be.equal(401);
  });

  it('Mensagem de erro, quando não existe token... (criar partidas)', async () => {
    const response = await chai.request(app)
      .post('/matches')
      .set({ authorization: '' })
      .send();

    expect(response.status).to.be.equal(401);
  });
});
