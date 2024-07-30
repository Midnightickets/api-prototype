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

const Landing = mongoose.model('Landing', landingSchema)

module.exports = {
    Landing,
    landingSchema,
}