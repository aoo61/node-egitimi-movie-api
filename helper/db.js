const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect('mongodb+srv://movie_user:0321654987a.@movie-api-ippbg.mongodb.net/test', { useNewUrlParser: true, useUnifiedTopology: true});

    mongoose.connection.on('open', () => {          // https://cloud.mongodb.com bağlantısı yapma
        console.log("MongoDB : Connected");
    });

    mongoose.connection.on('error', (err) => {
        console.log("MongoDB : Error", err);
    });

    mongoose.Promise = global.Promise;
};