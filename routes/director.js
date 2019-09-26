const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const Director = require('../models/Director');

router.post('/', (req, res) => {
    const director = new Director (req.body);

    director.save()
    .then(data => {
        res.json(data);
    }).catch(err => {
        res.json(err);
    });
});

router.get('/', (req, res) => {
    Director.aggregate([
        {
            $lookup: {
                from: 'movies',
                foreignField: 'director_id',
                localField: '_id',
                as: 'movies'
            }
        },
        {
            $unwind: {          // yukarıda ki oluşturduğumuz movie verisinin diğer alanlarda da kullanılmasını sağlamak için yazıyoruz.
                path: '$movies',
                preserveNullAndEmptyArrays: true        // join işleminde join yapılmayan verilerinde görüntülenmesi için
            }
        },
        {
            $group: {
                _id: {
                    _id: '$_id',            // burası grouplandırma yapıyor. yani aynı verilerin tek bir grup altında olmasını sağlıyor.
                    name: '$name',
                    surname: '$surname',
                    bio: '$bio',
                },
                movies: {
                    $push: '$movies'
                }
            }
        },
        {
            $project: {                         // bizi iç içe gösterimden kurtarıyor. normalde id nin altında ayrı ayrı gösterilecek
                _id: '$_id._id',                // olan veriler id olmadan göstermemizi sağlıyor.
                name: '$_id.name',
                surname: '$_id.surname',
                bio: '$_id.bio',
                movies: '$movies'
            }
        }
    ])
    .then(data => {
        res.json(data);
    }).catch(err => {
        res.json(err);
    });
});

router.get('/:director_id', (req, res) => {
    Director.aggregate([
        {
            $match: {
                '_id': mongoose.Types.ObjectId(req.params.director_id)          // match  ile require la birlilte url den gelen id değerini params
            }                                                                   // fonksiyonu ile alıyoruz ve _id değişkenine atıp o id ye
        },                                                                      // ait kayıdı getiriyoruz.
        {
            $lookup: {
                from: 'movies',
                foreignField: 'director_id',
                localField: '_id',
                as: 'movies'
            }
        },
        {
            $unwind: {
                path: '$movies',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: {
                    _id: '$_id',
                    name: '$name',
                    surname: '$surname',
                    bio: '$bio'
                },
                movies: {
                    $push: '$movies'
                }
            }
        },
        {
            $project: {
                _id: '$_id._id',
                name: '$_id.name',
                surname: '$_id.surname',
                bio: '$_id.bio',
                movies: '$movies'
            }
        }
    ])
    .then(data => {
        res.json(data);
    }).catch(err => {
        res.json(err);
    })
});

router.put('/:director_id', (req, res, next) => {
    Director.findByIdAndUpdate(req.params.director_id, req.body, {new: true})
    .then(director => {
        if (!director)
            next({ message: 'Bu id ye ait bir yönetmen yok', code: 80});
        else
            res.json(director);
    }).catch(err => {
        res.json(err);
    });
});

router.delete('/:director_id', (req, res, next) => {
    Director.findByIdAndRemove(req.params.director_id)
    .then(director => {
        if (!director)
            next({ message: "Bu id ye ait yönetmen yok", code: 81});
        else
            res.json({status : 1});
    }).catch(err => {
        res.json(err);
    });
});

module.exports = router;