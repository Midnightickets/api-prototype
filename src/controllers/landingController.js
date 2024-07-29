const LandingManager = require("../managers/LandingManager");

const landingController = {
  saveLandingInfo: async (req, res) => {
    try {
      await LandingManager.saveEmail(req.body).then((response) => {
        console.log(response);
        res.status(201).json(response);
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = landingController;
