const PaymentManager = require("../managers/PaymentManager");
const HostManager = require("../managers/HostManager");
const { Listener: ListenerModel } = require("../models/Listener");
const { RecargaPayment: RecargaPaymentModel } = require("../models/RecargaPayment");
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
      const listener = new ListenerModel({ specs: req.body });
      await listener.save();
      if(req.body.action == 'payment.updated'){
        const pagamento = await PaymentManager.buscarPagamento(req.body.data.id)
        const recargaPayment = RecargaPaymentModel.findOne({payment_id: req.body.data.id})
        if(pagamento &&  recargaPayment && pagamento.status === 'approved'){
          const host = await HostManager.buscarHostIdSimples(recargaPayment.host)
          host.subCoins += 999
          await host.save()
          console.log('Pagamento confirmado, subcoins recebidas')
        }
      }
      res.status(201).json()
    } catch (error) {
      res.status(400).json(error);
    }
  },
};

module.exports = MPpaymentController;
