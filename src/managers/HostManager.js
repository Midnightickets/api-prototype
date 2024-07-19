const { Host: HostModel } = require("../models/Host");

const HostManager = {
    async createHost(hostData) {
        // console.log(JSON.stringify(hostData));
        const host = new HostModel(hostData);
        await host.save();
        return host;
    },
    async getHostById(id) {
        return HostModel.findById(id);
    },
    async getHostByCpfCnpj(cpf_cnpj) {
        return HostModel.findOne({ cpf_cnpj });
    },
    async getHostByEmail(email) {
        return HostModel.findOne({ email });
    },
    async getHosts() {
        return HostModel.find();
    },
    async updateHost(id, hostData) {
        return HostModel.findByIdAndUpdate(id, hostData, { new: true });
    },
    async deleteHost(id) {
        return HostModel.findByIdAndDelete(id);
    }
};

module.exports = HostManager;   