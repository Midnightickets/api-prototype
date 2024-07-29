const { ErrorEnum } = require('../enums/Enums');
const { Landing: LandingModel } = require('../models/Landing');

const LandingManager = {
    saveEmail: async (body) => {
        if(typeof body.email !== 'string' || body.email.length == 0 || body.email.length > 255 || !body.email.includes('@')) {
            throw new Error(ErrorEnum.INVALID_EMAIL);
        }
        const landing = new LandingModel(body);
        return await landing.save();
    }
}

module.exports = LandingManager;