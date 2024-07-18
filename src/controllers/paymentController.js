require("dotenv").config();
const PaymentManager = require("../managers/PaymentManager");

const MPpaymentController = {
  getPagamento: async (req, res) => {
    try {
      const response = await PaymentManager.buscarPagamento(req.body.id);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  brick_payment: async (req, res) => {
    try {
      const response = await PaymentManager.brickPayment(req.body);
      return res.status(201).json(response);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  createPreference: async (req, res) => {
    const { items, purpose } = req.body;
    try {
      const response = await PaymentManager.createPreference(items, purpose);
      return res.status(200).json({ id: response.id });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

module.exports = MPpaymentController;
