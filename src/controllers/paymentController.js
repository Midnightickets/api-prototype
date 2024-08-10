const PaymentManager = require("../managers/PaymentManager");
const HostManager = require("../managers/HostManager");
const PacoteManager = require("../managers/PacoteManager");
const { Listener: ListenerModel } = require("../models/Listener");
const {
  RecargaPayment: RecargaPaymentModel,
} = require("../models/RecargaPayment");
const MercadoPagoEnums = require("../enums/MercadoPagoEnums");
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
      const pacote = await PacoteManager.getCoinsValorByValue(req.body.pacote);
      if (pacote) {
        const response = await PaymentManager.saveRecargaPayment(req.body);
        return res.status(201).json(response);
      }
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  host_notification_listener: async (req, res) => {
    console.log("🔔 Notificação Atualização Pagamento Mercado Pago 💷\n" + JSON.stringify(req.body));
    try {
      const listener = new ListenerModel({ specs: req.body });
      await listener.save();
      if (req.body.action === MercadoPagoEnums.LISTENER_UPDATED) {
        const pagamento = await PaymentManager.buscarPagamento(
          req.body.data.id
        );
        const recargaPayment = await RecargaPaymentModel.findOne({
          payment_id: req.body.data.id,
        });
        if (pagamento.status === MercadoPagoEnums.PAYMENT_STATUS_APPROVED) {
          const host = await HostManager.buscarHostIdSimples(
            recargaPayment.host
          );
          const pct = await PacoteManager.getCoinsValorByValue(
            recargaPayment.pacote
          );
          if (pct) {
            host.purpleCoins += pct.purpleCoinsCredito;
            host.subCoins += pct.subCoinsCredito;
            await host.save().then(() => {
              console.log("Compra Bem Sucedida, Saldos do Host Atualizado");
            });
          }
        }
        recargaPayment.status = pagamento.status;
        await recargaPayment.save().then(() => {
          console.log("Status do pagamento atualizado");
        });
      }
      res.status(201).json();
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  },
};

module.exports = MPpaymentController;
