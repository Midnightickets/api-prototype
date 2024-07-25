const { ErrorEnum } = require('../enums/Enums');
const { Evento: EventoModel } = require('../models/Evento');
const HostManager = require('./HostManager');

const EventoValidations = {
    validaTituloEventoHost: async (evento, host) => {
        const eventoObject = await EventoModel.find({ titulo: evento.titulo, host: host.id });
        if (eventoObject.length > 0) {
            throw new Error(ErrorEnum.EVENTO_TITULO_EXISTENTE);
        }
        return eventoObject;
    }
}

const EventoManager = {
    createEvento: async (evento, host) => {
        if (!await HostManager.getHostById(host)) {
            throw new Error(ErrorEnum.HOST_NOT_FOUND);
        }
        await EventoValidations.validaTituloEventoHost(evento, host)

        const eventoObject = {
            ...evento,
            host: host.id
        }
        const eventoModel = new EventoModel(eventoObject);
        await eventoModel.save();
        return eventoModel;
    },
    getEventoById: async (host) => {
        return EventoModel.find({id: host.id, senha: host.senha});
    },
}


module.exports = EventoManager;