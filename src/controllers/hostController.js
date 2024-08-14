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
    login_host: async (req, res) => {
        await HostManager.loginHost(req.body)
            .then((host) =>{
                res.status(200).json({host,  role: 'host' });
            })
            .catch((error) => {
                res.status(400).json({ error: error.message });
            });
    },
    update_moneys: async (req, res) => {
        await HostManager.getUpdatedMoneys(req.body)
            .then((host) =>{
                res.status(200).json(host);
            })
            .catch((error) => {
                res.status(400).json({ error: error.message });
            });
    },
    create_access_person: async (req, res) => {
        await HostManager.createAccessPerson(req.body)
            .then((access) =>{
                res.status(201).json(access);
            })
            .catch((error) => {
                res.status(400).json({ error: error.message });
            });
    },
    get_access_people: async (req, res) => {
        await HostManager.getAccessPeople(req.body)
            .then((access) =>{
                res.status(200).json(access);
            })
            .catch((error) => {
                res.status(400).json({ error: error.message });
            });
    },
}

module.exports = hostController;