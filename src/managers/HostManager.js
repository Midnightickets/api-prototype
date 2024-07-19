const { ErrorEnum } = require("../enums/Enums");
const { Host: HostModel } = require("../models/Host");
const bcrypt = require('bcrypt');

const HostManager = {
    async createHost(hostData) {
        if(!hostData.senha) {
            throw new Error(ErrorEnum.PASSWORD_REQUIRED);
        } else if(hostData.senha.length > 20 || hostData.senha.length < 8) {
            throw new Error(ErrorEnum.PASSWORD_LENGTH);
        }
        try{
            // Criptografar a senha
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(hostData.senha, salt);
            hostData.senha = hashedPassword;
            const host = new HostModel(hostData);
            await host.save();
            return host;
        } catch (error) {
            throw new Error(ErrorEnum.CREATE_HOST_GENERIC);
        }
    },

    async getHostById(host) {
        const hostObject = await HostModel.find({ _id: host.id, senha: host.senha_crip });
        return hostObject;
    },

    async deleteHost(id) {
        return HostModel.findByIdAndDelete(id);
    },
    
};

module.exports = HostManager;
