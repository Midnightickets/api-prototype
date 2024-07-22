const { Pacote: PacoteModel } = require('../models/Pacote');

const PacoteManager = {
    createPacote: async (pacote) => {
        return PacoteModel.create(pacote);
    },
    getPacotes: async () => {
        return PacoteModel.find();
    },
}

module.exports = PacoteManager;