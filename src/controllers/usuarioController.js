const { ErrorEnum } = require('../enums/Enums');
const UsuarioManager = require('../managers/UsuarioManager');

const usuarioController = {
    criar_usuario:async (req, res) => {
        await UsuarioManager.createUsuario(req.body)
        .then((response) => {
            return res.status(201).json(response);
        })
        .catch((error) => {
            if(error.code === 11000) {
                return res.status(400).json({error: ErrorEnum.USER_EXISTENT});
            }
            return res.status(400).json({error: error.message});
        });
    },
    loginUsuario: async (req, res) => {
        await UsuarioManager.login(req.body)
        .then((response) => {
            return res.status(200).json(response);
        })
        .catch((error) => {
            return res.status(400).json(error);
        });
    }
}

module.exports = usuarioController;
