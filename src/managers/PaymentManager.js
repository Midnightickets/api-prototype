require("dotenv").config();
const { MercadoPagoConfig, Preference } = require("mercadopago");
const mercadopago = require("mercadopago");
const { v4: uuidv4 } = require("uuid");
const { RecargaPayment: RecargaPaymentModel } = require("../models/RecargaPayment");

const client = new MercadoPagoConfig({
  accessToken: process.env.PROD_ACCESS_TOKEN,
});
const preference = new Preference(client);
const payment = new mercadopago.Payment(client);

function generateIdempotencyKey() {
  return uuidv4();
}

const PaymentManager = {
  buscarPagamento: async (id) => {
    try {
      const response = await payment.get({ id: id });
      return response;
    } catch (error) {
      throw error;
    }
  },
  brickPayment: async (reqBody) => {
    try {
      const idempotencyKey = generateIdempotencyKey();
      reqBody.notification_url = process.env.NOTIFICATION_URL;
      // console.log(reqBody)
      const response = await payment.create({ body: reqBody, three_d_secure_mode: 'optional', requestOptions:{
        idempotencyKey: idempotencyKey
      }});
      return response;
    } catch (error) {
      throw new Error(error);
    }
  },
  createPreference: async (reqBody) => {
    try {
      const response = await preference.create({ body: reqBody });
      console.log('preference', response)
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

