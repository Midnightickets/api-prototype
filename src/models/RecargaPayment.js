const mongoose = require('mongoose')

const { Schema } = mongoose

const recargaPaymentSchema = new Schema({
    payment_id: {
        type: String,
    },
    preference_id: {
        type: String,
    },
    host: {
        type: Schema.Types.ObjectId,
        ref: 'Host',
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    pacote:{
        type: Object,
        required: true,
    },
},
    { timestamps: true }
)

const RecargaPayment = mongoose.model('RecargaPayment', recargaPaymentSchema)

RecargaPayment.createIndexes();
module.exports = {
    RecargaPayment,
    recargaPaymentSchema,
}