const mongoose = require('mongoose')

const { Schema } = mongoose

const recargaPaymentSchema = new Schema({
    payment_id: {
        type: String,
        required: true,
        unique: true,
    },
    specs: {
        type: Object,
        required: true,
    },
    host: {
        type: Schema.Types.ObjectId,
        ref: 'Host',
        required: true,
    },
},
    { timestamps: false }
)

recargaPaymentSchema.index({ payment_id: 1 }, { unique: true });
const RecargaPayment = mongoose.model('RecargaPayment', recargaPaymentSchema)

RecargaPayment.createIndexes();
module.exports = {
    RecargaPayment,
    recargaPaymentSchema,
}