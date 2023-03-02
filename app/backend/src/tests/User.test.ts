import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import UserModel from '../database/models/UserModel';
import { hashSync } from 'bcryptjs';
import generateToken from '../utils/Jwt';
import { verify } from 'jsonwebtoken';
import IJwt from '../interfaces/JwtInterface';

chai.use(chaiHttp);
const { expect } = chai;

describe('Testes de integração da rota /login', () => {

  afterEach(() => sinon.restore());

  it('Verifica se usuário obtem token ao logar com dados corretos', async () => {
    const mockLoginUser = { email: 'user@user.com', password: 'secret_password' } as UserModel;
    const mockHash = hashSync(mockLoginUser.password);
    const mockResult = { id: 2, userName: 'User', role: 'user', email: 'user@user.com', password: mockHash } as UserModel;

    sinon.stub(UserModel, 'findOne').resolves(mockResult);

    const mockPayload = { id: mockResult.id, role: mockResult.role };
    const token = generateToken(mockPayload);
    const response = await chai.request(app).post('/login').send(mockLoginUser);

    expect(response.status).to.be.equal(200);
    expect(response.body.token).to.be.equal(token);
  });

  it('Verifica se retorna mensagem de erro, caso email ou password não seja informado no login', async () => {
    const mockLoginUser = { password: 'qualquerCoisa' };
    const response = await chai.request(app).post('/login').send(mockLoginUser);

    expect(response.status).to.be.equal(400);
    expect(response.body).to.be.deep.equal({ message: 'All fields must be filled' });
  });

  it('Verifica se retorna erro quando passado algum email não cadastrado no banco', async () => {
    const mockLoginUser = { email: 'userMock@user.com', password: '123456789' };

    sinon.stub(UserModel, 'findOne').resolves(undefined);

    const response = await chai.request(app).post('/login').send(mockLoginUser);
    expect(response.status).to.be.equal(401);
    expect(response.body).to.be.deep.equal({ message: 'Invalid email or password' });
  });

  it('Verifica se está sendo passado um Token na requisição', async () => {
    const mockLoginUser = { req: { headers: { authorization: '' } } };
    const response = await chai.request(app).get('/login/role').send(mockLoginUser);

    expect(response.status).to.be.equal(401);
    expect(response.body).to.be.deep.equal({ message: 'Token not found' });
  });

  it('Verifica se o Token passado é valido', async () => {
    const token = generateToken({ id: 1, role: 'admin' });
    const mockLoginUser = { req: { headers: { authorization: token } } };
    const user = verify(mockLoginUser.req.headers.authorization, 'jwt_secret') as IJwt;
    const response = await chai.request(app).get('/login/role').set({authorization: token}).send(mockLoginUser);

    expect(response.status).to.be.equal(200);
    expect(response.body).to.be.deep.equal({ role: user.role });
  });
});
