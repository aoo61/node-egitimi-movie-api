const chai = require('chai');                           // unit testin amacı yazdığımız kodların doğruluğunu testini yapıyoruz ve bundan sonra
const chaiHttp = require('chai-http');                  // bizim veya bir başka kişinin yazacağı kodların doğruluğunu bu unit test ile kontrol
const should = chai.should();                           // ederek yapacaktır. unit test yapmak çok önemlidir özellikle büyük projelerde her parçanın
const server = require('../app');                       // doğru çalışıp çalışmadığını kontrol etmek ve projeyi bir bütün haline getirdiğinde
                                                        // sorunun nerede olduğunu bulmak için çok önemlidir.

//"test": "mocha --exit --recursive" package.json da    // burada exit ile testin bitirip çıkmasını sağlıyor recursive ile ise test altındaki bütün klasörlerin test edilmesini sağlıyor

chai.use(chaiHttp);

describe('Node Server', () => {                         // describe ların içinde birden çok it olabilir.
    it('(GET /) Anasayfayı döndürür.', (done) => {      // it ler içinde istediğimiz unit testleri yapabliriz.
        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);      // status 200 olmalıdır diyoruz eğer öyleyse done() nu geri döndürüyoruz.
                done();
            });
    });
});