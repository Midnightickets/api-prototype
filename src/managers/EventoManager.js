const { ErrorEnum } = require("../enums/Enums");
const { Evento: EventoModel } = require("../models/Evento");
const HostManager = require("./HostManager");
const PacoteManager = require("./PacoteManager");
const Utils = require("../utils");

const EventoValidations = {
  startEventoValidations: async (evento, host) => {
    await EventoValidations.checkREQUIRED(evento);
    await EventoValidations.validaTituloEventoHost(evento, host);
    await EventoValidations.validaSubhosts(evento.subhosts);
    await EventoValidations.validaQtdIngressos(evento);
    await EventoValidations.validaLocalizacao(evento);
  },
  checkREQUIRED: async (evento) => {
    // console.log(evento);
    if (
      !evento.titulo ||
      !evento.endereco ||
      !evento.contato ||
      !evento.data_evento ||
      !evento.localizacao ||
      !evento.idEventoOptions ||
      !evento.subhosts ||
      !evento.tipos_ingressos ||
      !evento.img_url
    ) {
      // console.log(evento);
      throw new Error(ErrorEnum.REQUIRED_FIELDS);
    }
  },
  validaTituloEventoHost: async (evento, host) => {
    const eventoObject = await EventoModel.find({
      titulo: evento.titulo,
      host: host.id,
    });
    if (eventoObject.length > 0) {
      throw new Error(ErrorEnum.EVENTO_TITULO_EXISTENTE);
    }
  },
  validaSubhosts: async (subhosts) => {
    if (!Array.isArray(subhosts)) {
      throw new Error(ErrorEnum.INVALID_SUBHOSTS);
    }
    for (const cpf of subhosts) {
      await Utils.validaCPF(cpf);
    }
  },
  validaQtdIngressos: async (evento) => {
    if (
      !Array.isArray(evento.tipos_ingressos) ||
      evento.tipos_ingressos.length === 0
    ) {
      throw new Error(ErrorEnum.INVALID_TIPOS_INGRESSOS);
    }
    for (const tipo of evento.tipos_ingressos) {
      if (!tipo.tipo || !tipo.preco || typeof tipo.qtd !== "number") {
        throw new Error(ErrorEnum.INVALID_TIPOS_INGRESSOS);
      }
    }
    const totalQtdIngressos = evento.tipos_ingressos.reduce(
      (total, tipo) => total + tipo.qtd,
      0
    );
    if (totalQtdIngressos > evento.qtd_ingressos) {
      throw new Error(ErrorEnum.INVALID_QTD_INGRESSOS);
    }
  },
  validaLocalizacao: async (evento) => {
    if (
      !evento.localizacao.includes(
        '<iframe src="https://www.google.com/maps/embed'
      ) &&
      !evento.localizacao.includes("</iframe>")
    ) {
      throw new Error(ErrorEnum.INVALID_LOCALIZACAO);
    }
    const regex = /src="([^"]*)"/;
    const match = evento.localizacao.match(regex);
    if (match) {
      evento.localizacao = match[1];
    } else {
      throw new Error(ErrorEnum.INVALID_LOCALIZACAO);
    }
  },
  verificarSaldoPurpleCoinsHostPacote: async (host, evento) => {
    const pct = await PacoteManager.getEventoPacoteByValue(
      evento.idEventoOptions
    );
    if (host.purpleCoins < pct.purpleCoins) {
      console.log("SALDO PURPLECOINS INSUFICIENTE");
      throw new Error(ErrorEnum.PURPLECOINS_INSUFICIENTE);
    }
    return pct;
  },
};

const EventoManager = {
  createEvento: async (evento, host) => {
    const myhost = await HostManager.getHostById(host);
    const pct = await EventoValidations.verificarSaldoPurpleCoinsHostPacote(
      myhost,
      evento
    );
    await EventoValidations.startEventoValidations(evento, host);
    const msgPurpleCoins = await HostManager.usarPurpleCoins(myhost, pct);
    const eventoObject = {
      ...evento,
      host: host.id,
      qtd_ingressos: pct.max_ingressos,
    };
    const eventoModel = new EventoModel(eventoObject);
    await eventoModel.save();
    const eventoResponse = {
      eventoModel,
      msgPurpleCoins,
    };
    return eventoResponse;
  },
};

module.exports = EventoManager;
