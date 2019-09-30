const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    director_id: Schema.Types.ObjectId,
    title: {
        type: String,
        required: [true, '{PATH} alanı boş olamaz.'],
        maxlength: [50, '{PATH} alanı {MAXLENGTH} karakterden daha az olmalıdır.'],
        minlength: [3, '{PATH} alanı {MINLENGTH} karakterden daha çok olmalıdır.'],
        createIndexes: [true, '{PATH} alanı benzersiz olmalıdır. Aynı isimde başka bir film var.']
    },
    category: String,
    country: String,
    year: Number,
    imdb_score: {
        type: Number,
        max: [10, '{PATH} değeri en yüksek {MAX} olmalıdır.'],
        min: [0, '{PATH} değeri en düşük {MIN} olmalıdır']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('movie', MovieSchema);    // birinci parametre veritabanında oluşturulacak veya kaydedilecek
                                                                // collection un adı ikinci parametre oluşturulan schema nın adı