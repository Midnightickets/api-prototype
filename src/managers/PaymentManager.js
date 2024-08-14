require("dotenv").config();
const { MercadoPagoConfig, Preference } = require("mercadopago");
const mercadopago = require("mercadopago");
// const { v4: uuidv4 } = require("uuid");
const { RecargaPayment: RecargaPaymentModel } = require("../models/RecargaPayment");
const { ErrorEnum } = require("../enums/Enums");
const HostManager = require("./HostManager");

const client = new MercadoPagoConfig({
  accessToken: process.env.PROD_ACCESS_TOKEN,
});
const preference = new Preference(client);
const payment = new mercadopago.Payment(client);

// function generateIdempotencyKey() {
//   return uuidv4();
// }

const PaymentManager = {
  buscarPagamento: async (id) => {
    try {
      const response = await payment.get({ id: id });
      return response;
    } catch (error) {
      throw error;
    }
  },
  buscarPagamentosByHost: async (host) => {
    try {
      const hostValid = await HostManager.getHostByIdCript(host);
      const response = await RecargaPaymentModel.find({ host: hostValid._id })
        .sort({ createdAt: -1 }); // Ordenar por data de criação, mais recente primeiro
      return response;
    } catch (error) {
      throw new Error(ErrorEnum.ERROR_FINDING_PAYMENTS);
    }
  },
  // brickPayment: async (reqBody) => {
  //   try {
  //     const idempotencyKey = generateIdempotencyKey();
  //     reqBody.notification_url = process.env.NOTIFICATION_URL;
  //     // console.log(reqBody)
  //     const response = await payment.create({ body: reqBody, three_d_secure_mode: 'optional', requestOptions:{
  //       idempotencyKey: idempotencyKey
  //     }});
  //     return response;
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // },
  createPreference: async (reqBody) => {
    try {
      const recargaPayment = {
        preference_id: '',
        host: reqBody.host,
        status: 'preference.created',
        pacote: reqBody.pacote,
      };
      const recargaPaymentCreated = await PaymentManager.saveRecargaPayment(recargaPayment);
      reqBody.items[0].description = recargaPaymentCreated._id;
      const response = await preference.create({ body: reqBody })
      .catch((error) => { console.log(error) })
      
      recargaPaymentCreated.preference_id = response.id;
      await recargaPaymentCreated.save().catch((error) => { console.log(error); throw new Error(error); });

      return response;
    } catch (error) {
      throw error;
    }
  },
  saveRecargaPayment: async (recargaPayment) => {
    try {
      const newRecargaPayment = new RecargaPaymentModel(recargaPayment);
      const response = await newRecargaPayment.save();
      return response;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = PaymentManager

