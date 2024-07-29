const mongoose = require('mongoose')

const { Schema } = mongoose

const landingSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    dispositivo: {
        // rastrear qual o tamanho da tela do dispositivo ou tipo de dispositivo
        type: String,
        required: true,
    },
    // objeto para armazenar os dados do formulário preenchidos pelo usuário (opcional)
    form: {
        type: Object,
    }
    },
    { timestamps: true }
)

landingSchema.index({ email: 1 }, { unique: true });

const Landing = mongoose.model('Landing', landingSchema)

Landing.createIndexes();
module.exports = {
    Landing,
    landingSchema,
}