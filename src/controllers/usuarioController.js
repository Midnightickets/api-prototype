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
             res.status(200).json(response);
        }).catch(() => {
             res.status(400).json(ErrorEnum.INVALID_CREDENTIALS);
        });
        
    }
}

module.exports = usuarioController;
