const { ErrorEnum, StatusEnum } = require("../enums/Enums");
const { Evento: EventoModel } = require("../models/Evento");
const HostManager = require("./HostManager");
const PacoteManager = require("./PacoteManager");
const Utils = require("../utils");

const EventoActions = {
  startCreateEventoAction: async (evento, host) => {
    //fluxo de validacao para criacao de eventos
    await EventoActions.checkREQUIRED(evento);
    await EventoActions.validaTituloEventoHost(evento, host);
    await EventoActions.validaSubhosts(evento.subhosts);
    await EventoActions.validaQtdIngressos(evento);
    await EventoActions.validaLocalizacao(evento);
  },
  checkREQUIRED: async (evento) => {
    // console.log(evento);
    if (
      !evento.titulo ||
      !evento.endereco ||
      !evento.contato ||
      !evento.data_evento ||
      !evento.pacote ||
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
      if (!tipo.titulo || !tipo.valor || !tipo.quantidade) {
        throw new Error(ErrorEnum.INVALID_TIPOS_INGRESSOS);
      }
    }
    const totalQtdIngressos = evento.tipos_ingressos.reduce(
      (total, tipo) => total + tipo.quantidade,
      0
    );
    if (totalQtdIngressos > evento.qtd_ingressos) {
      throw new Error(ErrorEnum.INVALID_QTD_INGRESSOS);
    }
  },
  validaLocalizacao: async (evento) => {
    if (!evento.localizacao || evento.localizacao.trim() === "") {
      return;
    }
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
    const pct = await PacoteManager.getEventoPacoteByValue(evento.pacote);
    if (host.purpleCoins < pct.purpleCoins) {
      throw new Error(ErrorEnum.PURPLECOINS_INSUFICIENTE);
    }
    return pct;
  },
  montarResponseEventos: (eventos) => {
    return eventos.map((evento) => {
      return {
        id: evento._id,
        titulo: evento.titulo,
        data_evento:
          evento.data_evento.replaceAll("-", "/") + " às " + evento.hora_evento,
        status: evento.status,
        pacote: evento.pacote.label,
        subhosts: evento.subhosts.length,
        tipos_ingressos: evento.tipos_ingressos.length + " tipo(s)",
        qtd_ingressos: evento.qtd_ingressos,
      };
    });
  },
};

const EventoManager = {
  createEvento: async (evento, host) => {
    const myhost = await HostManager.getHostById(host);
    evento.subhosts = [myhost.cpf_cnpj];
    const pct = await EventoActions.verificarSaldoPurpleCoinsHostPacote(
      myhost,
      evento
    );
    await EventoActions.startCreateEventoAction(evento, host);
    const totalIngressos = evento.tipos_ingressos.reduce(
      (total, tipo) => total + tipo.quantidade,
      0
    );
    const msgPurpleCoins = await HostManager.usarPurpleCoins(
      myhost,
      pct,
      totalIngressos
    );
    const eventoObject = {
      ...evento,
      status: StatusEnum.EM_ANDAMENTO,
      host: host.id,
      qtd_ingressos: totalIngressos,
    };
    const eventoModel = new EventoModel(eventoObject);
    await eventoModel.save();
    const eventoResponse = {
      eventoModel,
      msgPurpleCoins,
      host: {
        id: myhost._id,
        purpleCoins: myhost.purpleCoins,
        subCoins: myhost.subCoins,
      },
    };
    return eventoResponse;
  },
  getEventoByHost: async (host, evento) => {
    const query = { host: host };

    if (evento.titulo) {
      query.titulo = { $regex: evento.titulo, $options: "i" }; // 'i' para case insensitive
    }

    if (evento.status) {
      query.status = StatusEnum.EM_ANDAMENTO;
    }

    const eventos = await EventoModel.find(query).populate("host");

    return EventoActions.montarResponseEventos(eventos);
  },
};

module.exports = EventoManager;
