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
    async deleteHost(id) {
        return HostModel.findByIdAndDelete(id);
    },
};

module.exports = HostManager;   