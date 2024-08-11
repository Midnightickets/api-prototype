const mongoose = require('mongoose')

const { Schema } = mongoose

const eventoSchema = new Schema({
    titulo: {
        type: String,
        required: true,
        maxlength: 80
    },
    descricao: {
        type: String,
        maxlength: 800,
    },
    endereco: {
        type: String,
        required: true,
        maxlength: 100,
    },
    contato: {
        type: String,
        required: true,
        maxlength: 100,
    },
    data_evento: {
        type: String,
        required: true,
    },
    hora_evento: {
        type: String,
        required: true,
    },
    hora_final: {
        type: String,
    },
    localizacao: {
        type: String,
        maxlength: 400,
    },
    pacote: {
        type: Object,
        required: true,
    },
    subhosts: {
        // arrays de cpfs das pessoas que poderam validar ingressos no evento
        type: [Object],
        required: true,  
    },
    qtd_ingressos: {
        type: Number,
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
    status: {
        type: String,
        required: true
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