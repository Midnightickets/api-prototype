const mongoose = require('mongoose')

const { Schema } = mongoose

const usuarioSchema = new Schema({
    cpf: {
        type: String,
        required: true,
        unique: true,
        maxlength: 14
    },
    senha:{
        type: String,
        required: true,
        maxlength: 100,
    },
    nome: {
        type: String,
        maxlength: 70,
        required: true,
    },
    dataNascimento:{
        type: Date,
    },
    telefone:{
        type: String,
        required: true,
        unique: true,
        maxlength: 30,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        maxlength: 100,
    }, 
    },
    { timestamps: true }

)
usuarioSchema.index({ cpf: 1 }, { unique: true });
usuarioSchema.index({ email: 1 }, { unique: true });
usuarioSchema.index({ telefone: 1 }, { unique: true });

const Usuario = mongoose.model('Usuario', usuarioSchema)

Usuario.createIndexes();
module.exports = {
    Usuario,
    usuarioSchema,
}