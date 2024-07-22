const mongoose = require('mongoose')

const { Schema } = mongoose

const pacoteSchema = new Schema({
    titulo: {
        type: String,
        unique: true,
        required: true,
        maxlength: 50
    },
    valor: {
        type: Number,
        required: true,
    },
    regras: {
        type: String,
        required: true,
    },
    },
    { timestamps: true }
)
pacoteSchema.index({ titulo: 1 }, { unique: true });

const Pacote = mongoose.model('Pacote', pacoteSchema)

Pacote.createIndexes();
module.exports = {
    Pacote,
    pacoteSchema,
}