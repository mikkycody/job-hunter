/* eslint-env mocha */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';

chai.use(chaiHttp);
require('dotenv').config();

describe('App Runs', () => {
  it('Should run the app', (done) => {
    chai
      .request(server)
      .get('/api/v1')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
});

describe('Auth', () => {
  const user = {
    firstName: 'Samuel',
    lastName: 'George',
    email: `${Math.random().toString(36).substring(2, 15)}@test.com`,
    password: 'password',
  };

  it('Should signup a user', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('token');
        // expect(res.body.data).to.be.an('object');
        // expect(res.body)
        //   .to.have.property('message')
        //   .equal('User created successfully');
        done();
      });
  });
  it('Should not signup a user with incomplete fields', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send({ email: 'sammy@sammy.com' })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error').equal('"password" is required');
        done();
      });
  });
  it('Should authenticate a valid user', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/signin')
      .send({
        email: user.email,
        password: 'password',
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body)
          .to.have.property('token')
        done();
      });
  });
  it('Should not signin a user with incomplete fields', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/signin')
      .send({ password: 'password' })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error').equal('"email" is required');

        done();
      });
  });
  it('Should not signin a user with incorrect password', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/signin')
      .send({
        email: 'admin@admin.com',
        password: 'passwordsss',
      })
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('error').equal('Login failed');
        done();
      });
  });
  it('Should not signup a user that exists', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
      })
      .end((err, res) => {
        expect(res.status).to.equal(409);
        done();
      });
  });
});
