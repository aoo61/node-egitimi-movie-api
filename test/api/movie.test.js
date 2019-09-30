const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../../app');

chai.use(chaiHttp);

let token;

describe('/api/movies test', () => {
    before((done) => {                                          // burası test ten önce yapılmasını istediğimiz şeylerin yazıldığı fonksiyon
        chai.request(server)                                    // server dan istek yapıyoruz.
            .post('/authenticate')
            .send({username: 'aoo61', password: '0321654987a.'})    // server a kullanıcı adımızı ve şifremizi gönderiyoruz.
            .end((err, res) => {                                 // geri dönen callback fonksiyonundan token i alıyoruz test te kullanmak için
                token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFvbzYxIiwiaWF0IjoxNTY5ODQ1NjkwLCJleHAiOjE1Njk4NDY0MTB9.Q7krXaeFIDjYaEevcetfMKwQb04FdBRrvOc5_WmtuBc";
                //token = res.body.token;
                done();
            });
    });
    describe('GET /movies', () => {
        it('it should GET all the movies', done => {
            chai.request(server)
                .get('/movies')                               // movies url ini getiriyoruz.
                .set('x-access-token', token)                     // token i x-acces-token e set ediyoruz.
                .end((err, res) => {
                    res.should.have.status(200);            // cevabın status u 200 olmalı
                    res.body.should.be.a('array');          // dönen data array olmalı sorgusu yapıyoruz.
                    done();
                })
        });
    });
});