require("dotenv").config();
const LandingManager = require("../managers/LandingManager");
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const landingController = {
  saveLandingInfo: async (req, res) => {
    try {
      await LandingManager.saveEmail(req.body).then((response) => {
        console.log(response);
        res.status(201).json(response);
      });
      await client.messages
      .create({
        body: "MIDNIGHT TICKETS, novo email cadastrado: " + req.body.email,
        from: "whatsapp:+14155238886",
        to: "whatsapp:+556181748795",
      })
      .then((message) => console.log(message))
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = landingController;
