const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.body.token || req.query.token;   // burada tokeni alabileceğimiz yerlerden alıyoruz.
// req.query  movies?token= eyJhbGcisXVCJ9.eyJ1c2VybmFtZSI6ImFvbzY5OTV9.OTvlG1f9RuabSEpMyzAv8nqS8E şeklinde almamızı sağlıyor.
    if (token){
        jwt.verify(token, req.app.get('api_secret_key'), (err, decoded) => {        // aldığımız token i verify ettiriyoruz. yani onaylatıyoruz.
            if (err){                                                               // biirinci parametre aldığımız token ikinci parametre
                res.json({                                                          // secret key i alıyoruz.
                    status: false,
                    message: 'Failed to authenticate token'
                })
            }else{
                req.decode = decoded;                   // decoded verify den geriye dönen callback fonksiyonundan bize geri dönen çözümlenmiş
                console.log(decoded);                   // tokenin payload kısmını require atıyoruz.
                next();                                 // sonra herşey yolunda ise next ile bir sonraki route a next yapıyoruz.
            }
        })
    }else{
        res.json({
            status: false,
            message: 'No token provided'
        })
    }
};