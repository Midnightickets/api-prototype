const HostManager = require("../managers/HostManager");

const hostController = {
    criar_host: async (req, res) => {
        await HostManager.createHost(req.body)
            .then((host) =>{
                res.status(201).json(host)
            })
            .catch((error) => {
                res.status(400).json({ error: error.message });
            });
    },
}

module.exports = hostController;