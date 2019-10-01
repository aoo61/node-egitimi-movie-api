const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../../app');

chai.use(chaiHttp);

let token, directorId;

describe('/director test', () => {
   before(done => {
       chai.request(server)
           .post('/authenticate')
           .send({username: 'ali6141', password: '123456789'})
           .end((err, res) => {
               if(err)
                   throw err;
               token = res.body.token;
               done();
           });
   });

   describe('GET /directors', () => {
       it('it should GET all the director', done => {
           chai.request(server)
               .get('/api/directors')
               .set('x-access-token', token)
               .end((err, res) => {
                   if(err)
                       throw err;
                   res.should.have.status(200);
                   res.body.should.be.a('array');
                   directorId = res.body[0]._id;
                   done();
               });
       });
   });

   describe('POST /directors', () => {
       it('it should POST a director', done => {
           const director = {
               name: 'Ali Osman',
               surname: 'Özoğlu',
               bio: 'Computer Engineer'
            };

           chai.request(server)
               .post('/api/directors')
               .send(director)
               .set('x-access-token', token)
               .end((err, res) => {
                   if(err)
                       throw err;
                   res.should.have.status(200);
                   res.body.should.be.a('object');
                   res.body.should.have.property('_id');
                   res.body.should.have.property('name');
                   res.body.should.have.property('surname');
                   res.body.should.have.property('bio');
                   done();
               });
       });
   });

   describe('GET /:director_id', () => {
       it('it should GET a director by the given id', done => {
           chai.request(server)
               .get('/api/directors/' + directorId)
               .set('x-access-token', token)
               .end((err, res) => {
                   if(err)
                       throw err;
                   res.should.have.status(200);
                   res.body.should.have.be.a('array');
                   done();
               });
       });
   });

   describe('PUT /:director_id', () => {
       it('it should GET a director by the given id', done => {
           const director = {
               name: 'Cem',
               surname: 'Yılmaz',
               bio: 'Aktör'
           };
           chai.request(server)
               .put('/api/directors/' + directorId)
               .set('x-access-token', token)
               .send(director)
               .end((err, res) => {
                   if(err)
                       throw err;
                   res.should.have.status(200);
                   res.body.should.be.a('object');
                   res.body.should.have.property('name').eql(director.name);
                   res.body.should.have.property('surname').eql(director.surname);
                   res.body.should.have.property('bio').eql(director.bio);
                   done();
               });
       });
   });

   describe('DELETE /:director_id', () => {
       it('it should DELETE a director given by id', done => {
           chai.request(server)
               .delete('/api/directors/' + directorId)
               .set('x-access-token', token)
               .end((err, res) => {
                   if(err)
                       throw err;
                   res.should.have.status(200);
                   res.body.should.be.a('object');
                   res.body.should.have.property('status').eql(1);
                   done();
               });
       });
   });
});