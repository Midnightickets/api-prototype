const { ErrorEnum, SuccessEnum } = require("../enums/Enums");
const { Host: HostModel } = require("../models/Host");
const bcrypt = require("bcrypt");

const HostValidations = {
  startHostValidations: async (host) => {
    await HostValidations.checkREQUIRED(host);
    await HostValidations.validaSenha(host);
    await HostValidations.validaEmailLoginTelefone(host);
    await HostValidations.validaCpfCnpj(host);
  },
  checkREQUIRED: async (host) => {
    if (
      !host.email ||
      !host.login ||
      !host.senha ||
      !host.nome_razao ||
      !host.telefone ||
      !host.cpf_cnpj ||
      !host.saque
    ) {
      throw new Error(ErrorEnum.REQUIRED_FIELDS);
    }
  },
  validaSenha: async (host) => {
    if (host.senha.length > 20 || host.senha.length < 8) {
      throw new Error(ErrorEnum.PASSWORD_LENGTH);
    }
  },
  validaEmailLoginTelefone: async (host) => {
    const hostObject = await HostModel.find({
      $or: [
        { email: host.email },
        { login: host.login },
        { telefone: host.telefone },
      ],
    });
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
};

const HostInicialization = {
  startHostInicialization: async (host) => {
    await HostInicialization.criptografarSenha(host);
    host.saldo = 0;
    host.purpleCoins = 0;
    host.subCoins = 0;
  },
  criptografarSenha: async (host) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(host.senha, salt);
    host.senha = hashedPassword;
  },
};

const HostManager = {
  createHost: async (hostData) => {
    try {
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
  getHostIdByEvento: async (eventoId) => {
    const hostObject = await HostModel.findOne({ eventos: eventoId });
    if (!hostObject) {
      throw new Error(ErrorEnum.HOST_NOT_FOUND);
    }
    return hostObject._id;
  },
  getAKMercadoPagoByHost: async (hostId) => {
    const hostObject = await HostModel.findOne({ _id: hostId });
    if (!hostObject) {
      throw new Error(ErrorEnum.HOST_NOT_FOUND);
    }
    return hostObject.saque.mp_ac;
  },
  createAccessPerson: async (host, access) => {
    if(!access.id || !access.nome) {
      throw new Error(ErrorEnum.REQUIRED_FIELDS);
    }
    const hostValid = await HostManager.getHostByIdCript(host);
    if(!hostValid.acessos || hostValid.acessos.length === 0) {
      hostValid.acessos = [];
    } else {
      hostValid.acessos.forEach((element) => {
        if (element.id === access.id) {
          throw new Error(ErrorEnum.ACCESS_PEOPLE_EXISTENTE);
        }
      })
    }
    hostValid.acessos.push(access);
    await hostValid.save();
    return access;
  },
  getAccessPeople: async (host) => {
    const hostValid = await HostManager.getHostByIdCript(host);
    return hostValid.acessos;
  },
  removeAccessPerson: async (host, access) => {
    if(!access.id) {
      throw new Error(ErrorEnum.REQUIRED_FIELDS);
    }
    const hostValid = await HostManager.getHostByIdCript(host);
    hostValid.acessos = hostValid.acessos.filter((element) => element.id !== access.id);
    await hostValid.save();
    return access;
  },
  buscarHostIdSimples: async (id) => {
    const host = await HostModel.findOne({ _id: id });
    if (!host) {
      throw new Error(ErrorEnum.HOST_NOT_FOUND);
    }
    return host;
  },
  deleteAccessPerson: async (host, access) => {
    if(!access.id) {
      throw new Error(ErrorEnum.REQUIRED_FIELDS);
    }
    const hostValid = await HostManager.getHostByIdCript(host);
    hostValid.acessos = hostValid.acessos.filter((element) => element.id !== access.id);
    await hostValid.save();
    return access;
  },
  getUpdatedMoneys: async (host) => {
    const hostObject = await HostModel.findOne({ _id: host.id, senha: host.senha });
    if (!hostObject) {
      throw new Error(ErrorEnum.HOST_NOT_FOUND);
    }
    const resHost = {
      id: hostObject._id,
      img: hostObject.img,
      login: hostObject.login,
      senha: hostObject.senha,
      email: hostObject.email,
      nome_razao: hostObject.nome_razao,
      cpf_cnpj: hostObject.cpf_cnpj,
      telefone: hostObject.telefone,
      saldo: hostObject.saldo,
      purpleCoins: hostObject.purpleCoins,
      subCoins: hostObject.subCoins,
    };
    return resHost;
  },
  getHostById: async (host) => {
    if (!host.id || !host.senha) {
      throw new Error(ErrorEnum.HOST_NOT_FOUND);
    }
    const hostObject = await HostModel.findOne({ _id: host.id });
    if (!hostObject) {
      throw new Error(ErrorEnum.HOST_NOT_FOUND);
    } else {
      if (await bcrypt.compare(host.senha, hostObject.senha)) {
        return hostObject;
      } else {
        throw new Error(ErrorEnum.INCORRECT_PASSWORD);
      }
    }
  },
  getHostByIdCript: async (host) => {
    if (!host.id || !host.senha) {
      throw new Error(ErrorEnum.HOST_NOT_FOUND);
    }
    const hostObject = await HostModel.findOne({ _id: host.id });
    if (!hostObject) {
      throw new Error(ErrorEnum.HOST_NOT_FOUND);
    } else {
      if (host.senha === hostObject.senha) {
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
    const coinsCashBack = pct.max_ingressos - totalIngressos;
    host.subCoins += coinsCashBack;
    host.purpleCoins -= pct.purpleCoins;
    await host.save();
    const msg =
      pct.purpleCoins.toString() +
      " PurpleCoins utilizados"
    return msg;
  },
  loginHost: async (hostReq) => {
    if (!hostReq.login || !hostReq.senha) {
      throw new Error(ErrorEnum.REQUIRED_FIELDS);
    }
    const host = await HostModel.findOne({ login: hostReq.login });
    if (host && (await bcrypt.compare(hostReq.senha, host.senha))) {
      await host.save();
      const hostResponse = {
        id: host._id,
        login: host.login,
        email: host.email,
        senha: host.senha,
        img: host.img,
        nome_razao: host.nome_razao,
        saldo: host.saldo,
        telefone: host.telefone,
        cpf_cnpj: host.cpf_cnpj,
        purpleCoins: host.purpleCoins,
        subCoins: host.subCoins,
      };
      return hostResponse;
    } else {
      throw new Error(ErrorEnum.HOST_NOT_FOUND);
    }
  },
  transformSubCoins: async (host) => {
    const hostValid = await HostManager.getHostByIdCript(host);
    if(hostValid.subCoins < 5000) {
      throw new Error(ErrorEnum.SUBCOINS_INSUFICIENTE);
    }   
    hostValid.subCoins -= 5000;
    hostValid.purpleCoins += 1;
    await hostValid.save();

    return SuccessEnum.SUBCOINS_TRANSFORMED;
  },
};

module.exports = HostManager;
