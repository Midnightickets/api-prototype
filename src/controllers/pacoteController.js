const PacoteManager = require('../managers/PacoteManager');

const pacoteController = {
    create_pacote: async (req, res) => {
        await PacoteManager.createPacote(req.body)
            .then((pacote) => {
                return res.status(201).json(pacote);
            }
            ).catch((error) => {
                return res.status(400).json(error);
            }
            );
    },
    get_pacotes: async (req, res) => {
        await PacoteManager.getPacotes()
            .then((pacotes) => {
                return res.status(200).json(pacotes);
            }
            ).catch((error) => {
                return res.status(400).json(error);
            }
            );
    },

}

module.exports = pacoteController;