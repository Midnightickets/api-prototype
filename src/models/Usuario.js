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
        maxlength: 100,
        required: true,
    },
    dataNascimento:{
        type: Date,
        required: true,
    },
    telefone:{
        type: String,
        required: true,
        maxlength: 30,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        maxlength: 60,
    }, 
    logado:{
        type: Boolean,
        required: true,
    },
    },
    { timestamps: true }

)
usuarioSchema.index({ cpf: 1 }, { unique: true });
usuarioSchema.index({ email: 1 }, { unique: true });

const Usuario = mongoose.model('Usuario', usuarioSchema)

Usuario.createIndexes();
module.exports = {
    Usuario,
    usuarioSchema,
}