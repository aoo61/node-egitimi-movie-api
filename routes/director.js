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

module.exports = router;