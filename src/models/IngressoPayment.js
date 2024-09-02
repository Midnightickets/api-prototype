const mongoose = require('mongoose')

const { Schema } = mongoose

const ingressoPaymentSchema = new Schema({
    payment_id: {
        // id pagamento mercado pago
        type: String,
    },
    preference_id: {
        type: String,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    ingresso:{
        type: Object,
        required: true,
    },
    evento: {
        type: Schema.Types.ObjectId,
        ref: 'Evento',
        required: true,
    },
},
    { timestamps: true }
)

const IngressoPayment = mongoose.model('IngressoPayment', ingressoPaymentSchema)

IngressoPayment.createIndexes();
module.exports = {
    IngressoPayment,
    ingressoPaymentSchema,
}