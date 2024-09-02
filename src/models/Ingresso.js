const mongoose = require('mongoose')

const { Schema } = mongoose

const ingressoSchema = new Schema({
    cpf: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    evento: {
        type: Schema.Types.ObjectId,
        ref: 'Evento',
        required: true
    },
    payment: {
        type: Schema.Types.ObjectId,
        ref: 'IngressoPayment',
        required: true
    },
    ingresso: {
        type: Object,
        required: true
    },
    status: {
        type: String,
        required: true
    },
},
    { timestamps: true }
)

ingressoSchema.index({ code: 1 }, { unique: true });

const Ingresso = mongoose.model('Ingresso', ingressoSchema)

Ingresso.createIndexes();
module.exports = {
    Ingresso,
    ingressoSchema,
}