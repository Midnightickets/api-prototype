const mongoose = require('mongoose')

const { Schema } = mongoose

const eventoSchema = new Schema({
    titulo: {
        type: String,
        required: true,
        maxlength: 50
    },
    descricao: {
        type: String,
        required: true,
        maxlength: 400,
    },
    endereco: {
        type: String,
        required: true,
        maxlength: 10,
    },
    contato: {
        type: [String],
        required: true,
        maxlength: 200,
    },
    data_evento: {
        type: Date,
        required: true,
    },
    localizacao: {
        type: String,
        required: true,
        maxlength: 400,
    },
    access_code: {
        type: String,
        required: true,
        maxlength: 4
    },
    subhost: {
        // arrays de cpfs das pessoas que poderam validar ingressos no evento
        type: [String],
        required: true,    
    },
    tipos_ingressos: {
        type: [Object],
        required: true,
    },
    img_url: {
        type: String,
        required: true,
    },
    host: {
        type: Schema.Types.ObjectId,
        ref: 'Host',
        required: true
    },
    img_type: {
        type: String,
        required: false
    }
    },
    { timestamps: false }
)

const Evento = mongoose.model('Evento', eventoSchema)

Evento.createIndexes();
module.exports = {
    Evento,
    eventoSchema,
}