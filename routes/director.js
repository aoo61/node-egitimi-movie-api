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
                as: 'movie'
            }
        },
        {
            $unwind: {          // yukarıda ki oluşturduğumuz movie verisinin diğer alanlarda da kullanılmasını sağlamak için yazıyoruz.
                path: '$movie',
                preserveNullAndEmptyArrays: true        // join işleminde join yapılmayan verilerinde görüntülenmesi için
            }
        },
        {
            $group: {
                _id: {
                    _id: '$_id',            // burası grouplandırma yapıyor. yani aynı verilerin tek bir grup altında olmasını sağlıyor.
                    name: '$name',
                    surname: '$surname',
                    bio: '$bio'
                },
                movies: {
                    $push: '$movie'
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

module.exports = router;