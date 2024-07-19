const HostManager = require("../managers/HostManager");

const hostController = {
    createHost: (req, res) => {
        HostManager.createHost(req.body)
            .then((host) => res.status(201).json(host))
            .catch((error) => res.status(400).json(error));
    },
}

module.exports = hostController;