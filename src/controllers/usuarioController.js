const UsuarioManager = require('../managers/UsuarioManager');

const usuarioController = {
    criar_usuario:async (req, res) => {
        await UsuarioManager.createUsuario(req.body)
        .then((response) => {
            return res.status(201).json(response);
        })
        .catch((error) => {
            return res.status(400).json(error);
        });
    },
}

module.exports = usuarioController;
