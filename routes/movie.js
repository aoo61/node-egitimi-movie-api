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

router.get('/', (req, res) => {
  Movie.aggregate([
      {
          $lookup: {
              from: 'directors',
              foreignField: '_id',
              localField: 'director_id',
              as: 'director'
          }
      },
      {
          $unwind: '$director'
      }
  ])
  .then((data) => {
      res.json(data);
  }).catch(err => {
      res.json(err);
  });
});

// TOP 10 LIST
router.get('/top10', (req, res) => {
    Movie.find({ }).sort({ imdb_score: -1}).limit(10)        // imdb score en iyi olan 10 filmi döndürür
    .then(data => {
        res.json(data);
    }).catch(err => {
        res.json(err);
    });
});

router.get('/:movie_id', (req, res, next) => {        // /:movie_id şeklinde yazınca movie_id adında bir değişken oluşturuluyor.
  Movie.findById(req.params.movie_id)                 // bu parametre url de movie/5d8b54ae83f2d71010626493 şeklinde girildiğinde
  .then(movie => {                                    // 5d8b54ae83f2d71010626493 bu veri movie_id ye atanıyor.
      if (!movie)
          next({message: 'Böyle bir film yok', code: 99});      // // BURADA PROMİSE YAPISI KULLLANILDI
      else
          res.json(movie);                            // bu movie_id kullanmak için require ın params fonksiyonunu kullanıyoruz.
  }).catch(err => {                                   // yani req.params.movie_id yazınca bize geri dönen değer 5d8b54ae83f2d71010626493 bu olacaktır.
      res.json(err);
  });
});

router.put('/:movie_id', (req, res, next) => {
    Movie.findByIdAndUpdate(req.params.movie_id, req.body, {new: true}) // 3. parametre olan new: true parametresi bize güncellediğimiz
    .then(movie => {                                                    // datanın güncel halini dönemesini sağlıyor.
        if (!movie)
            next({message: 'Böyle bir film yok güncelleme yapılamaz', code: 98});
        else
            res.json(movie);
    }).catch(err => {
        res.json(err);
    });

});

router.delete('/:movie_id', (req, res, next) => {
    Movie.findByIdAndRemove(req.params.movie_id)            // id si verilen veriyi silme
    .then(movie => {
        if (!movie)
            next({message: 'Böyle bir film yok', code: 97});
        else
            res.json({status: 1});
    }).catch(err => {
        res.json(err);
    });
});

router.get('/between/:start_year/:end_year', (req, res) => {
    const {start_year, end_year} = req.params;
    Movie.find({year: {"$gte": parseInt(start_year), "$lte": parseInt(end_year)}})      // iki tarih arasında yayınlanan filmleri verir
    .then(data => {                             // gte : büyük veya eşit        gt : büyük
        res.json(data);                         // lte : küçük veya eşit        lt : küçük
    }).catch(err => {
        res.json(err);
    });
});

module.exports = router;
