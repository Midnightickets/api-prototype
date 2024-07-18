const mongoose = require('mongoose')

const { Schema } = mongoose

const ingressoSchema = new Schema({
    titulo: {
        type: String,
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
        maxlength: 400,
    },
    usuario_comprador: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    valor: {
        type: Number,
        required: true
    },
    nome_ingresso: {
        type: String,
        required: true
    },
    evento: {
        type: Schema.Types.ObjectId,
        ref: 'Evento',
        required: true
    },
    data_compra: {
        type: Date,
        default: Date.now
    },
    telefone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    tipo_ingresso: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
},
    { timestamps: false }
)
ingressoSchema.index({ code: 1 }, { unique: true });

const Ingresso = mongoose.model('Ingresso', ingressoSchema)

Ingresso.createIndexes();
module.exports = {
    Ingresso,
    ingressoSchema,
}