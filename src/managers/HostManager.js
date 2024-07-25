const { ErrorEnum } = require("../enums/Enums");
const { Host: HostModel } = require("../models/Host");
const bcrypt = require('bcrypt');

const HostValidations = {
    startHostValidations: async (host) => {
        try {
            await HostValidations.checkREQUIRED(host);
            await HostValidations.validaSenha(host);
            await HostValidations.validaEmailLoginTelefone(host);
            await HostValidations.validaCpfCnpj(host);
        } catch (error) {
            console.log(error + 'ERROR: hostValidations');
            throw new Error(ErrorEnum.SISTEMA_GENERICO);
        }
    },
    checkREQUIRED: async (host) => {
        if (!host.email || !host.login || !host.senha || !host.nome_razao || !host.telefone || !host.cpf_cnpj || !host.pix) {
            throw new Error(ErrorEnum.REQUIRED_FIELDS);
        }
    },
    validaSenha: async (host) => {
        if(host.senha.length > 20 || host.senha.length < 8) {
            throw new Error(ErrorEnum.PASSWORD_LENGTH);
        }
    },
    validaEmailLoginTelefone: async (host) => {
        const hostObject = await HostModel.find({ $or: [{ email: host.email }, { login: host.login }, { telefone: host.telefone }] });
        if (hostObject.length > 0) {
            throw new Error(ErrorEnum.LOGIN_EXISTENTE);
        }
    },
    validaCpfCnpj: async (host) => {
        const hostObject = await HostModel.find({ cpf_cnpj: host.cpf_cnpj });
        if (hostObject.length > 0) {
            throw new Error(ErrorEnum.CPF_CNPJ_EXISTENTE);
        }
    },
}

const HostInicialization = {
    startHostInicialization: async (host) => {
        try {
            await HostInicialization.criptografarSenha(host);
            host.saldo = 0;
            host.purpleCoins = 0;
            host.subCoins = 0;
            host.logado = true;
        }  catch (error) {
            console.log(error + 'ERROR: hostInicialization');
            throw new Error(ErrorEnum.SISTEMA_GENERICO);
        }
    },
    criptografarSenha: async (host) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(host.senha, salt);
        host.senha = hashedPassword;
    },
}

const HostManager = {
    createHost: async (hostData) => {
        try{
            await HostValidations.startHostValidations(hostData);
            await HostInicialization.startHostInicialization(hostData);
            const host = new HostModel(hostData);
            await host.save();
            return host;
        } catch (error) {
            // throw new Error(ErrorEnum.CREATE_HOST_GENERIC);
            throw new Error(error);
        }
    },
    getHostById: async (host) => {
        const hostObject = await HostModel.find({ _id: host.id, senha: host.senha_crip });
        return hostObject;
    },
    deleteHost: async (id) => {
        return HostModel.findByIdAndDelete(id);
    },
    
};

module.exports = HostManager;
