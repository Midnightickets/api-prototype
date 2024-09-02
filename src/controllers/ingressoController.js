const IngressoManager = require("../managers/IngressoManager");

const IngressoController = {
    create_preference_ingresso: async (req, res) => {
        await IngressoManager.createPreference(req.body)
        .then((response) => {
          res.status(200).send({id: response});
        })
        .catch((error) => {
          res.status(500).send(error);
        });
    }
}

module.exports = IngressoController;