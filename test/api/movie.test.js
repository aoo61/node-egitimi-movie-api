const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../../app');

chai.use(chaiHttp);

let token, movieId;

describe('/movies test', () => {
    before((done) => {                                          // burası test ten önce yapılmasını istediğimiz şeylerin yazıldığı fonksiyon
        chai.request(server)                                    // server dan istek yapıyoruz.
            .post('/authenticate')
            .send({username: 'ali6141', password: '123456789'})    // server a kullanıcı adımızı ve şifremizi gönderiyoruz.
            .end((err, res) => {                                // geri dönen callback fonksiyonundan token i alıyoruz test te kullanmak için
                if(err)
                    throw err;
                token = res.body.token;
                done();
            });
    });

    describe('GET /movies', () => {
        it('it should GET all the movies', (done) => {
            chai.request(server)
                .get('/api/movies')                               // movies url ini getiriyoruz.
                .set('x-access-token', token)                     // token i x-acces-token e set ediyoruz.
                .end((err, res) => {
                    if(err)
                        throw err;
                    res.should.have.status(200);            // cevabın status u 200 olmalı
                    res.body.should.be.a('array');          // dönen data array olmalı sorgusu yapıyoruz.
                    movieId = res.body[0]._id;
                    done();
                });
        });
    });

    describe('POST /movies', () => {
        it('it should POST a movies', (done) => {
            const movie = {
                title: 'Udemy',
                director_id: '5d8b7ec939ba0e0914c8f16a',
                category: 'Komedi',
                country: 'Türkiye',
                year: 1995,
                imdb_score: 8.6
            };
            chai.request(server)
                .post('/api/movies')
                .send(movie)
                .set('x-access-token', token)
                .end((err, res) => {
                    if(err)
                        throw err;
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

    describe('GET /:movie_id', () => {
        it('it should GET a movie by the given id', (done) => {
            chai.request(server)
                .get('/api/movies/' + movieId)
                .set('x-access-token', token)
                .end((err, res) => {
                    if(err)
                        throw err;
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title');
                    res.body.should.have.property('director_id');
                    res.body.should.have.property('category');
                    res.body.should.have.property('year');
                    res.body.should.have.property('country');
                    res.body.should.have.property('imdb_score');
                    res.body.should.have.property('_id').eql(movieId);
                    done();
                });
        });
    });

    describe('PUT /:movie_id', () => {
        it('it should UPDATE a movie given by id', (done) => {
            const movie = {
                title: 'Maskeli Beşler',
                category: 'Suç ve Komedi',
                year: 2010,
                imdb_score: 7.5
            };

            chai.request(server)
                .put('/api/movies/' + movieId)
                .send(movie)
                .set('x-access-token', token)
                .end((err, res) => {
                    if(err)
                        throw err;
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title').eql(movie.title);
                    res.body.should.have.property('category').eql(movie.category);
                    res.body.should.have.property('year').eql(movie.year);
                    res.body.should.have.property('imdb_score').eql(movie.imdb_score);
                    done();
                });
        });
    });

    describe('DELETE /:movie_id', () => {
        it('it should DELETE a movie given by id', (done) => {
            chai.request(server)
                .delete('/api/movies/' + movieId)
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