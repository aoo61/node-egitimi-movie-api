const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
       type: String,
       minlength: [3, '{PATH} alanı {MINLENGTH} karakterden az olamaz.'],
       createIndexes: [true, '{PATH} alanı benzersiz olmalıdır. Bu username kullanımdadır.'],
       required: [true, '{PATH} alanı boş olamaz.']
    },
    password: {
        type: String,
        minlength: [6, '{PATH} alanı {MINLENGTH} karakterden az olamaz.'],
        maxlength: [100, '{PATH} alanı {MAXLENGTH} karakterden fazla olamaz.'],
        required: true
    }
});

module.exports = mongoose.model('users', UserSchema);