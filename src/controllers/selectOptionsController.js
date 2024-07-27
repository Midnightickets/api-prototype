// Desc: Controller para buscar as OPTIONS para preencher os SELECTS INPUTS no frontend (q-select)
const PacoteManager = require('../managers/PacoteManager');

const selectOptionsController = {
    get_evento_pacotes: async (req, res) => {
        await PacoteManager.getEventoPacotes(req, res)
            .then((pacotes) => {
                res.json(pacotes);
            })
            .catch((error) => {
                res.status(500).json({ message: error.message });
            });
    },
    get_coins: async (req, res) => {
        await PacoteManager.getCoinsValores(req, res)
            .then((coins) => {
                res.json(coins);
            })
            .catch((error) => {
                res.status(500).json({ message: error.message });
            });
    }
}

module.exports = selectOptionsController;