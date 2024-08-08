const PaymentManager = require("../managers/PaymentManager");
const HostManager = require("../managers/HostManager");
const MPpaymentController = {
  buscar_pagamento: async (req, res) => {
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
  criar_preference: async (req, res) => {
    const { items, purpose } = req.body;
    try {
      const response = await PaymentManager.createPreference(items, purpose);
      return res.status(200).json({ id: response.id });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  save_recarga_payment: async (req, res) => {
    try {
      const response = await PaymentManager.saveRecargaPayment(req.body);
      return res.status(201).json(response);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  notification_listener: async (req, res) => {
    try {
      if(req.body.action == 'payment.updatedfromwebhook'){
        const pagamento = PaymentManager.buscarPagamento(req.body.data.id)
        if(pagamento && pagamento.status != 'pending'){
          const host = await HostManager.buscarHostIdSimples(pagamento.host)
          host.subCoins += 1000
          await host.save()
          console.log('Pagamento confirmado, subcoins recebidas')
        }
      }
      console.log(req.body)
      res.status(201).json()
    } catch (error) {
      res.status(400).json(error);
    }
  },
};

module.exports = MPpaymentController;
