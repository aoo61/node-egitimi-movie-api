const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.post('/register', (req, res) => {
  const {username, password} = req.body;
  bcrypt.hash(password, 10).then(hash => {    // şifremizi şifrelemeye yarıyor. birinci parametreyi şifrelemek istediğimiz
    const user = new User({                        // veriyi giriyoruz ikinci parametreye ise şifreleme aralığını giriyoruz. yani
      username,                                    // kaç karakteri şifreleyeceğini giriyoruz.
      password: hash                               // burada ise şifrelenmiş ve bize callback olarak dönen hash i password a atıyoruz.
    });
    user.save()
    .then(() => {
      res.json({status: 1});
    }).catch(err => {
      res.json(err);
    })
  });
});

router.post('/authenticate', (req, res) => {
  const {username, password} = req.body;

  User.findOne({
    username: username
  }, (err, user) => {
    if (err)
      res.json(err);
    else{
      if (!user){
        res.json({
          status: false,
          message: 'Authenticate failed. User not found'
        });
      }else{
        bcrypt.compare(password, user.password)             // burada birinci parametre girdiğimiz password ikinci parametre ise
        .then((result) => {                                 // daha önce veritabanına kayıt edilmiş şifreli şekilde olan password ümüz
          if (!result) {                                    // compare fonksiyonu ile onu çevirip karşılaştırıyoruz. dönen değer boolean
            res.json({                                      // bir değer oluyor iki password eşleşirse true döner.
              status: false,
              message: 'Authenticate failed. Wrong is password'
            })
          }else{      // token eGciNiIsInR5cCI6IkpXVCJ9.eyJzoxNTE2MjM5MDIyfQ.SflKxwsJf36POk6yJV_adQssw5c şekilde 2 nokta ile ayrılmış
                      // 3 parçalı yapıdır. birinci parça algoritma ve token type olur ikinci parçada bizim oluşturduğumuz payload yani data
                      // üçüncü parçada ise imza kısmı olur secret key ile
            const payload = {       // payload oluşturuyoruz. token de kullanmak için
              username: username    // payload a önemli bilgiler yazılmaz. genelde benzersiz veriler yazılır.
            };
            const token = jwt.sign(payload, req.app.get('api_secret_key'), {      // burada token oluşturduk birinci parametre
              expiresIn: 720         //burada oturumun ne kadar süre açık         // yukarı da oluşturduğumuz payload 2. parametre ise
            });                      //kalacağını yazıyoruz. bu 12 saat kalacak.  // config.js dosyasında oluşturduğumuz api_secret_key
            res.json({                                                            // onu req.app.get fonksiyonu ile alıyoruz.
              status: true,       // burada herşey doğru ise geriye token i döndürüyoruz.
              token
            })
          }
        })
      }
    }
  });
});

module.exports = router;