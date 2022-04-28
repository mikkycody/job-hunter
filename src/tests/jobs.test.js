/* eslint-env mocha */
import chai, { expect } from 'chai';
import jwt from 'jsonwebtoken';
import chaiHttp from 'chai-http';
import server from '../app';

chai.use(chaiHttp);
require('dotenv').config()

const token = jwt.sign({ id: 1 }, 'secret', { expiresIn: 86400 });


describe('Jobs', () => {
  const job =  {
    name: 'Lorem ipsum',
    description: 'Lorem Ipsum',
    scheduleId: 1,
    scheduleDayId: 1,
    userId: 1,
  };


  it('Should create a job', (done) => {
    chai.request(server)
      .post('/api/v1/Jobs')
      .set('Authorization', ` Bearer ${token}`)
      .send(job)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('Should get Jobs', (done) => {
    chai.request(server)
      .get('/api/v1/Jobs')
      .set('Authorization', ` Bearer ${token}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('Should update a job', (done) => {
    chai.request(server)
      .put(`/api/v1/Jobs/1`)
      .set('Authorization', ` Bearer ${token}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
  it('Should delete a job', (done) => {
    chai.request(server)
      .delete(`/api/v1/Jobs/1`)
      .set('Authorization', ` Bearer ${token}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

});