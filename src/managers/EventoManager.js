const { ErrorEnum, StatusEnum, SuccessEnum } = require("../enums/Enums");
const { Evento: EventoModel } = require("../models/Evento");
const HostManager = require("./HostManager");
const PacoteManager = require("./PacoteManager");
const Utils = require("../utils");
const bcrypt = require("bcrypt");
const e = require("express");

const EventoActions = {
  startCreateEventoAction: async (evento, host) => {
    //fluxo de validacao para criacao de eventos
    await EventoActions.checkREQUIRED(evento);
    await EventoActions.validaDataEvento(evento);
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
      !evento.hora_evento ||
      !evento.pacote ||
      !evento.subhosts ||
      !evento.tipos_ingressos) {
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
  validaDataEvento: async (evento) => {
    // Convertendo a data de entrada para o formato adequado
    const [day, month, year] = evento.data_evento.split('-');
    const formatedDate = `${year}-${month}-${day}`;
 
    // Criando o objeto Date com a data do evento
    const dataEvento = new Date(formatedDate);

    // Obtendo a data atual
    const dataAtual = new Date();

    // Comparando as datas
    if (dataEvento < dataAtual) {
      throw new Error(ErrorEnum.INVALID_DATA_EVENTO);
    }
}

};

const EventoManager = {
  createEvento: async (evento, host) => {
    const myhost = await HostManager.getHostById(host);
    evento.subhosts = [];
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
      access_code: Utils.generateAccessCode(),
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
  getEventosByHost: async (host, evento) => {
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
  getEventoByHost: async (host, evento) => {
    const hostValido = await HostManager.getHostByIdCript(host)
    // console.log(hostValido);
    const eventoObject = await EventoModel.findById(evento.id);
    if (!eventoObject) {
      throw new Error(ErrorEnum.EVENTO_NOT_FOUND);
    }
    return eventoObject;
  },
  atualizarEvento: async (evento, host) => {
    const myhost = await HostManager.getHostByIdCript(host);
    evento.id = evento._id;
    const eventoObject = await EventoManager.getEventoByHost(myhost, evento);
    if(eventoObject.titulo !== evento.titulo){
      await EventoActions.validaTituloEventoHost(evento, myhost);
    }
    await EventoActions.validaDataEvento(evento)
    await EventoActions.validaLocalizacao(evento)
    eventoObject.titulo = evento.titulo;
    eventoObject.img_url = evento.img_url;
    eventoObject.descricao = evento.descricao;
    eventoObject.contato = evento.contato;
    eventoObject.data_evento = evento.data_evento;
    eventoObject.hora_evento = evento.hora_evento;
    eventoObject.hora_final = evento.hora_final;
    eventoObject.endereco = evento.endereco;
    eventoObject.localizacao = evento.localizacao;
    eventoObject.access_code = evento.access_code;
    await eventoObject.save()
    .catch((err) => {
        throw new Error(ErrorEnum.REQUIRED_FIELDS);
    })
    return SuccessEnum.UPDATED_EVENTO;
  },
  atualizarSubhostsEvento: async (evento, host) => {
    const myhost = await HostManager.getHostByIdCript(host);
    evento.id = evento._id;
    const eventoObject = await EventoManager.getEventoByHost(myhost, evento);
    await EventoActions.validaSubhosts(evento.subhosts);

    eventoObject.subhosts = evento.subhosts;
    await eventoObject.save()
    .catch((err) => {
      console.log(err);
        throw new Error(ErrorEnum.REQUIRED_FIELDS);
    })
    return eventoObject.subhosts;
  },
}

module.exports = EventoManager;
