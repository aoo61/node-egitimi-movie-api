const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DirectorSchema = new Schema ({
    name: {
        type: String,
        maxlength: [50, '{PATH} alanı {MAXLENGTH} karakterden fazla olamaz.'],
        minlength: [3, '{PATH} alanı {MINLENGTH} karakterden az olamaz.'],
        required: [true, '{PATH} alanı boş olamaz.']
    },
    surname: {
        type: String,
        maxlength: [50, '{PATH} alanı {MAXLENGTH} karakterden fazla olamaz.'],
        minlength: [3, '{PATH} alanı {MINLENGTH} karakterden az olamaz.'],
        required: [true, '{PATH} alanı boi olamaz.']
    },
    bio: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('director', DirectorSchema);