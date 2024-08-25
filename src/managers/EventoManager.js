const { ErrorEnum, StatusEnum, SuccessEnum } = require("../enums/Enums");
const { Evento: EventoModel } = require("../models/Evento");
const HostManager = require("./HostManager");
const PacoteManager = require("./PacoteManager");
const Utils = require("../utils");

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
      !evento.tipos_ingressos
    ) {
      // console.log(evento);
      throw new Error(ErrorEnum.REQUIRED_FIELDS);
    }
  },
  validaTituloEventoHost: async (evento, host) => {
    const eventoObject = await EventoModel.find({
      titulo: evento.titulo,
      host: host.id,
      status: StatusEnum.EM_ANDAMENTO,
    });
    if (eventoObject.length > 0) {
      throw new Error(ErrorEnum.EVENTO_TITULO_EXISTENTE);
    }
    evento.titulo = evento.titulo.trim().toUpperCase();
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
      ) ||
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
        access_code: evento.access_code,
      };
    });
  },
  validaDataEvento: async (evento) => {
    const [day, month, year] = evento.data_evento.split("-");
    const dataEventoDate = new Date(year, month - 1, day); // Mês é zero-indexado

    const dataAtual = new Date();
    dataAtual.setHours(0, 0, 0, 0); // Zera as horas para comparação

    if (dataEventoDate < dataAtual) {
      throw new Error(ErrorEnum.INVALID_DATA_EVENTO);
    }
  },
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
    const checkTitulosIguais = () => {
      evento.tipos_ingressos.forEach((ingresso) => {
        evento.tipos_ingressos.forEach((ingressoObject) => {
          if (
            ingresso.titulo.trim().toLowerCase() ===
            ingressoObject.titulo.trim().toLowerCase()
          ) {
            throw new Error(ErrorEnum.TITULO_INGRESSO_EXISTENTE);
          } else {
            ingresso.titulo = ingresso.titulo.trim().toUpperCase();
          }
        });
      });
    };
    checkTitulosIguais();
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
      faturamento: 0,
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
  getEventoToIngresso: async (ingresso) => {
    const evento = await EventoModel.findById(ingresso.evento);
    evento.tipos_ingressos.forEach((tipo) => {});
  },
  getEventoByHost: async (host, evento) => {
    const hostValido = await HostManager.getHostByIdCript(host);
    // console.log(hostValido);
    const eventoObject = await EventoModel.findById(evento.id);
    if (!eventoObject) {
      throw new Error(ErrorEnum.EVENTO_NOT_FOUND);
    }
    return eventoObject;
  },
  atualizarEvento: async (evento, host) => {
    if (evento.status !== StatusEnum.EM_ANDAMENTO) {
      throw new Error(ErrorEnum.EVENTO_INDISPONIVEL);
    }
    const myhost = await HostManager.getHostByIdCript(host);
    evento.id = evento._id;
    const eventoObject = await EventoManager.getEventoByHost(myhost, evento);
    if (eventoObject.titulo !== evento.titulo) {
      await EventoActions.validaTituloEventoHost(evento, myhost);
    }
    await EventoActions.validaDataEvento(evento);
    if (eventoObject.localizacao !== evento.localizacao) {
      await EventoActions.validaLocalizacao(evento);
      eventoObject.localizacao = evento.localizacao;
    }
    eventoObject.titulo = evento.titulo;
    eventoObject.img_url = evento.img_url;
    eventoObject.descricao = evento.descricao;
    eventoObject.contato = evento.contato;
    eventoObject.data_evento = evento.data_evento;
    eventoObject.hora_evento = evento.hora_evento;
    eventoObject.hora_final = evento.hora_final;
    eventoObject.endereco = evento.endereco;
    eventoObject.access_code = evento.access_code;
    await eventoObject.save().catch((err) => {
      throw new Error(ErrorEnum.REQUIRED_FIELDS);
    });
    return SuccessEnum.UPDATED_EVENTO;
  },
  atualizarSubhostsEvento: async (evento, host) => {
    const myhost = await HostManager.getHostByIdCript(host);
    evento.id = evento._id;
    const eventoObject = await EventoManager.getEventoByHost(myhost, evento);
    await EventoActions.validaSubhosts(evento.subhosts);

    eventoObject.subhosts = evento.subhosts;
    await eventoObject.save().catch((err) => {
      console.log(err);
      throw new Error(ErrorEnum.REQUIRED_FIELDS);
    });
    return eventoObject.subhosts;
  },
  cancelarEvento: async (evento, host) => {
    const myhost = await HostManager.getHostByIdCript(host);
    evento.id = evento._id;
    const eventoObject = await EventoManager.getEventoByHost(myhost, evento);
    eventoObject.status = StatusEnum.CANCELADO;
    await eventoObject.save().catch((err) => {
      throw new Error(ErrorEnum.REQUIRED_FIELDS);
    });
    return SuccessEnum.CANCELED_EVENTO;
  },
  alterarLoteIngressos: async (evento, host) => {
    const myhost = await HostManager.getHostByIdCript(host);
    evento.id = evento._id;
    const eventoObject = await EventoManager.getEventoByHost(myhost, evento);
    const checkTituloIngressos = () => {
      evento.tipos_ingressos.forEach((ingresso) => {
        eventoObject.tipos_ingressos.forEach((ingressoObject) => {
          if (
            ingresso.titulo.trim().toLowerCase() ===
            ingressoObject.titulo.trim().toLowerCase()
          ) {
            throw new Error(ErrorEnum.TITULO_INGRESSO_EXISTENTE);
          } else {
            ingresso.titulo = ingresso.titulo.trim().toUpperCase();
          }
        });
      });
    };
    checkTituloIngressos();
    const formatStringToNumber = () => {
      evento.tipos_ingressos.forEach((ingresso) => {
        if (ingresso.valor.includes(",")) {
          ingresso.valor = ingresso.valor.replace(",", ".");
          ingresso.valor = Number(ingresso.valor).toFixed(2);
          ingresso.valor = ingresso.valor.replace(".", ",");
        } else {
          ingresso.valor = Number(ingresso.valor).toFixed(2);
          ingresso.valor = ingresso.valor.replace(".", ",");
        }
      });
    };
    formatStringToNumber();
    eventoObject.tipos_ingressos = evento.tipos_ingressos;
    await eventoObject.save().catch((err) => {
      throw new Error(ErrorEnum.UPDATE_LOTE_INGRESSO);
    });
    return {
      message: SuccessEnum.UPDATED_LOTE_INGRESSO,
      tipos_ingressos: eventoObject.tipos_ingressos,
    };
  },
  buscarEventoPorTitulo: async (titulo) => {
    const eventoObjects = await EventoModel.find({
      titulo: { $regex: titulo.trim().toUpperCase(), $options: "i" },
    }).populate("host");

    if (eventoObjects.length === 0 || titulo.trim() === "") {
      return [];
    }
    let responseEventos = [];
    eventoObjects.forEach((eventoObject) => {
      if (
        eventoObject.status === StatusEnum.EM_ANDAMENTO &&
        eventoObject.qtd_ingressos > 0
      ) {
        responseEventos.push({
          id: eventoObject._id,
          titulo: eventoObject.titulo,
          img_url: eventoObject.img_url,
          data_evento:
            eventoObject.data_evento.replaceAll("-", "/") +
            " às " +
            eventoObject.hora_evento,
          status: eventoObject.status,
          host_name: eventoObject.host.nome_razao,
        });
      }
    });
    return responseEventos;
  },
};

module.exports = EventoManager;
