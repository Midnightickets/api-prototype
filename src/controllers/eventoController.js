const { SuccessEnum } = require("../enums/Enums");
const EventoManager = require("../managers/EventoManager")

const eventoController = {
    criar_evento: async (req, res) => {
        await EventoManager.createEvento(req.body.evento, req.body.host)
        .then((evento) => {
            res.status(201).json({evento, message: SuccessEnum.CREATE_EVENTO});
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: err.message });
        });
    },
    buscar_eventos: async (req, res) => {
        await EventoManager.getEventosByHost(req.body.host, req.body.evento)
        .then((eventos) => {
            res.status(200).json(eventos);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: err.message });
        });
    },
    buscar_evento_host: async (req, res) => {
        await EventoManager.getEventoByHost(req.body.host, req.body.evento)
        .then((evento) => {
            res.status(200).json(evento);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: err.message });
        });
    },
    atualizar_evento: async (req, res) => {
        await EventoManager.atualizarEvento(req.body.evento, req.body.host)
        .then((message) => {
            res.status(200).json({ message });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: err.message });
        });
    },
    atualizar_subhosts_evento: async (req, res) => {
        await EventoManager.atualizarSubhostsEvento(req.body.evento, req.body.host)
        .then((acessos) => {
            res.status(200).json(acessos);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: err.message });
        });
    },
    cancelar_evento: async (req, res) => {
        await EventoManager.cancelarEvento(req.body.evento, req.body.host)
        .then((message) => {
            res.status(200).json({ message });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: err.message });
        });
    },
    alterar_lote_ingresso: async (req, res) => {
        await EventoManager.alterarLoteIngressos(req.body.evento, req.body.host)
        .then((response) => {
            res.status(200).json({ response });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: err.message });
        });
    },
    buscar_evento_titulo: async (req, res) => {
        await EventoManager.buscarEventoPorTitulo(req.body.titulo)
        .then((evento) => {
            res.status(200).json(evento);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: err.message });
        });
    }
}

module.exports = eventoController;