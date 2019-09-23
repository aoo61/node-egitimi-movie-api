var express = require('express');
var router = express.Router();

const Movie = require('../models/Movie');

router.post('/', (req, res, next) => {
  //const {title, category, country, year, imdb_score} = req.body;  // bu şekilde bütün verileri tek tek alabiliriz burada amaç eğer
                                                                    // veriler üzerinde değişiklik yapmak istersek kullanmak için
  /*const movie = new Movie({
    title: title,
    imdb_score: imdb_score,
    category: category,
    country: country,
    year: year
  });*/

  const movie = new Movie(req.body);            // bu şekilde de tek satırda bütün verileri alıp Movie sınıfına atabiliriz.

  /*movie.save((err, data) => {                 // veri tabanına kaydetme
    if(err)
      res.json(err);
    else
      res.json({ status: 1 });
  });*/
  movie.save()                  // bu şekilde de veritabanına kayıt eklenebilir
  .then(() => {
    res.json({status:1});
  }).catch(err => {
    res.json(err);
    })
});

module.exports = router;
