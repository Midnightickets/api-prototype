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
    }
}

module.exports = eventoController;