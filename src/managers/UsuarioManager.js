const { Usuario: UsuarioModel } = require("../models/Usuario");
const bcrypt = require("bcrypt");
const ErrorEnum = require("../enums/Enums");
require('dotenv').config();
// const accountSid = process.env.ACCOUNT_SID;
// const authToken = 'process.env.AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);

// client.verify.v2.services(process.env.VERIFY_SERVICE_SID)
//       .verifications
//       .create({to: '+55' + usuario.telefone.replace(/[^\d]/g, ''), channel: 'sms'})
    //   .then(verification => console.log(verification.sid));

const UsuarioManager = {
    createUsuario: async (usuario) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(usuario.senha, salt);
        usuario.senha = hashedPassword;
        return await UsuarioModel.create(usuario);
    },
    getUser: async (user) => {
        if(!user.senha || user.senha.trim() === '' || user.senha === undefined) {
            throw new Error(ErrorEnum.PASSWORD_REQUIRED);
        }
        return await UsuarioModel.findOne(user);
    },
    login: async (user) => {
        const usuario = await UsuarioModel.findOne({login: user.login});
        if (usuario && (await bcrypt.compare(user.senha, usuario.senha))) {
            usuario.save();
            return usuario;
        } else {
            return null;
        }
    },
    logout: async (user) => {
        const usuario = await UsuarioModel.findOne({login: user.login, senha: user.senha});
        usuario.save();
        return true
    },
}

module.exports = UsuarioManager;    