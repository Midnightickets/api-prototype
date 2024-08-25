const mongoose = require('mongoose')

const { Schema } = mongoose

const ingressoSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
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
    payment_stats: {
        type: Object,
        // required: true
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