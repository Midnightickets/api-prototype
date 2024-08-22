const { Usuario: UsuarioModel } = require("../models/Usuario");
const bcrypt = require("bcrypt");
const ErrorEnum = require("../enums/Enums");
const Utils = require("../utils");
require('dotenv').config();
// const accountSid = process.env.ACCOUNT_SID;
// const authToken = 'process.env.AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);

// client.verify.v2.services(process.env.VERIFY_SERVICE_SID)
//       .verifications
//       .create({to: '+55' + usuario.telefone.replace(/[^\d]/g, ''), channel: 'sms'})
    //   .then(verification => console.log(verification.sid));

const UsuarioValidation = {
    checkObrigatorio:async (usuario) => {
        if (!usuario.cpf || usuario.cpf.trim() === '' || !usuario.senha || usuario.senha.trim() === '' || usuario.senha.length < 6 || !usuario.nome || usuario.nome.trim() === '' || !usuario.telefone || usuario.telefone.trim() === '' || !usuario.email || usuario.email.trim() === '') {
            throw new Error(ErrorEnum.REQUIRED_FIELDS);
        }
        await Utils.validaCPF(usuario.cpf)
    }
}

const UsuarioManager = {
    createUsuario: async (usuario) => {
        await UsuarioValidation.checkObrigatorio(usuario)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(usuario.senha, salt);
        usuario.senha = hashedPassword;
        const newUser = new UsuarioModel(usuario);
        await newUser.save()
        return {
            nome: newUser.nome,
            cpf: newUser.cpf,
            email: newUser.email,
            telefone: newUser.telefone,
            login: newUser.login,
            senha: newUser.senha
        };
    },
    atualizarUsuario: async (usuario) => {
        await UsuarioManager.getUserCrypt(usuario);
    }   
    ,
    getUserCrypt: async (user) => {
        if(!user.senha || user.senha.trim() === '' || !user.cpf || user.cpf.trim() === '') {
            throw new Error(ErrorEnum.INVALID_CREDENTIALS);
        }
        const userExist = await UsuarioModel.findOne(user);
        if(!userExist || userExist.senha !== user.senha) {
            throw new Error(ErrorEnum.USER_NOT_FOUND);
        } 
        if (user.senha === userExist.senha) {
            return userExist;
        }
    },
    login: async (user) => {
        const usuario = await UsuarioModel.findOne({cpf: user.cpf});
        if (usuario && (await bcrypt.compare(user.senha, usuario.senha))) {  
            return usuario;
        } else{
            throw new Error(ErrorEnum.INVALID_CREDENTIALS);
        }
    },
}

module.exports = UsuarioManager;    