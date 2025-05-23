const mongoose = require('mongoose')

const { Schema } = mongoose

const hostSchema = new Schema({
    cpf_cnpj: {
        type: String,
        required: true,
        unique: true,
        maxlength: 30
    },
    senha:{
        type: String,
        required: true,
        maxlength: 100,
    },
    nome_razao: {
        type: String,
        maxlength: 80,
        required: true,
    },
    img:{
        type: String,
    },
    login:{
        type: String,
        required: true,
        maxlength: 30,
        unique: true,
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
    saldo:{
        type: Number,
        required: true,
    },
    purpleCoins:{
        type: Number,
        required: true,
    },
    subCoins:{
        type: Number,
        required: true,
    },
    acessos:{
        type: [Object],      
    },
    saque:{
        type: Object,
        required: true,
    },
    },
    { timestamps: true }

)
hostSchema.index({ cpf_cnpj: 1 }, { unique: true });
hostSchema.index({ login: 1 }, { unique: true });
hostSchema.index({ email: 1 }, { unique: true });

const Host = mongoose.model('Host', hostSchema)

Host.createIndexes();
module.exports = {
    Host,
    hostSchema,
}