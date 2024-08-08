const { ErrorEnum } = require("../enums/Enums");
const { Host: HostModel } = require("../models/Host");
const bcrypt = require('bcrypt');

const HostValidations = {
    startHostValidations: async (host) => {
            await HostValidations.checkREQUIRED(host);
            await HostValidations.validaSenha(host);
            await HostValidations.validaEmailLoginTelefone(host);
            await HostValidations.validaCpfCnpj(host);
    },
    checkREQUIRED: async (host) => {
        if (!host.email || !host.login || !host.senha || !host.nome_razao || !host.telefone || !host.cpf_cnpj || !host.saque) {
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
        // FAZER VALIDACAO CPF E CNPJ
        const hostObject = await HostModel.find({ cpf_cnpj: host.cpf_cnpj });
        if (hostObject.length > 0) {
            throw new Error(ErrorEnum.CPF_CNPJ_EXISTENTE);
        }
    },
}

const HostInicialization = {
    startHostInicialization: async (host) => {
            await HostInicialization.criptografarSenha(host);
            host.saldo = 0;
            host.purpleCoins = 0;
            host.subCoins = 0;
            host.logado = true;
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
        if(!host.id || !host.senha) {
            throw new Error(ErrorEnum.REQUIRED_FIELDS);
        }
        const hostObject = await HostModel.findOne({ _id: host.id });
        if (!hostObject) {
            throw new Error(ErrorEnum.HOST_NOT_FOUND);
        }
        else {
            if (await bcrypt.compare(host.senha, hostObject.senha)) {
                return hostObject;
            } else {
                throw new Error(ErrorEnum.INCORRECT_PASSWORD);
            }
        }
    },
    usarPurpleCoins: async (host, pct, totalIngressos) => {
        if (host.purpleCoins < pct.purpleCoins) {
            throw new Error(ErrorEnum.PURPLECOINS_INSUFICIENTE);
        }
        const coinsCashBack =  pct.max_ingressos - totalIngressos
        host.subCoins += coinsCashBack
        host.purpleCoins -= pct.purpleCoins
        await host.save()
        const msg = (pct.purpleCoins.toString() + ' PurpleCoins utilizados com sucesso Saldo atual: ' + host.purpleCoins.toString())
        return msg
    },
    loginHost: async (hostReq) => {
            if (!hostReq.login || !hostReq.senha) {
                throw new Error(ErrorEnum.REQUIRED_FIELDS);
            }
            const host = await HostModel.findOne({login: hostReq.login});
            if (host && (await bcrypt.compare(hostReq.senha, host.senha))) {
                host.logado = true;
                await host.save();
                const hostResponse = {
                    id: host._id,
                    login: host.login,
                    email: host.email,
                    nome_razao: host.nome_razao,
                    saldo: host.saldo,
                    purpleCoins: host.purpleCoins,
                    subCoins: host.subCoins,
                }
                return hostResponse;
            } else {
                throw new Error(ErrorEnum.HOST_NOT_FOUND);
            }
    }
};

module.exports = HostManager;
