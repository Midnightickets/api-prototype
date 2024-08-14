const PaymentManager = require("../managers/PaymentManager");
const HostManager = require("../managers/HostManager");
const PacoteManager = require("../managers/PacoteManager");
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
  buscar_pagamentos_by_host: async (req, res) => {
    try {
      const response = await PaymentManager.buscarPagamentosByHost(req.body);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({message: error.message});
    }
  },
  // brick_payment: async (req, res) => {
  //   try {
  //     const response = await PaymentManager.brickPayment(req.body);
  //     return res.status(201).json(response);
  //   } catch (error) {
  //     return res.status(400).json(error);
  //   }
  // },
  criar_preference: async (req, res) => {
    try {
      const response = await PaymentManager.createPreference(req.body);
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
    console.log("🔔 Notificação Atualização Pagamento Mercado Pago 💷\n\n");
    try {
      console.log("🔔 MERCADO PAGO DIZ: 💷\n" + JSON.stringify(req.body));

      if (req.body.action === MercadoPagoEnums.LISTENER_UPDATED) {
        const pagamento = await PaymentManager.buscarPagamento(
          req.body.data.id
        ).catch((error) => { console.log(error); throw new Error(error); });
        const recargaPayment = await RecargaPaymentModel.findOne({
          _id: pagamento.additional_info.items[0].description,
        }).catch((error) => {
            console.log(error);
            throw new Error(error);
          });
        recargaPayment.payment_id = pagamento.id;
        recargaPayment.status = pagamento.status;
        await recargaPayment.save();
        if (pagamento.status === MercadoPagoEnums.PAYMENT_STATUS_APPROVED) {
          const host = await HostManager.buscarHostIdSimples(
            recargaPayment.host
          )
            .catch((err) => console.log(JSON.stringify(err)));
          const pct = await PacoteManager.getCoinsValorByValue(
            recargaPayment.pacote
          );  
          if (pct) {
            host.purpleCoins += pct.purpleCoinsCredito;
            host.subCoins += pct.subCoinsCredito;
            await host.save().then(() => {
              console.log("💷 Compra Bem Sucedida, Saldos do Host Atualizado\n\n");
            });
          }
        } else {
          recargaPayment.status = pagamento.status;
        }
        await recargaPayment.save().then(() => {
          console.log("Status do pagamento atualizado para " + pagamento.status.toUpperCase());
        });
      }
      res.status(201).json({ message: "Status do RECARGAPAYMENT atualizado com sucesso." });
    } catch (error) {
      console.log("Erro notification Listener:\n" + JSON.stringify(error));
      res.status(400).json(error);
    }
  },
};

module.exports = MPpaymentController;
