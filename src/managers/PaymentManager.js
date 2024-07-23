require("dotenv").config();
const { MercadoPagoConfig, Preference } = require("mercadopago");
const mercadopago = require("mercadopago");
const { v4: uuidv4 } = require("uuid");
const client = new MercadoPagoConfig({
  accessToken: process.env.PROD_ACCESS_TOKEN,
  // accessToken: process.env.MP_ACCESS_TOKEN,
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
      const response = await payment.create({ body: reqBody, idempotencyKey });
      return response;
    } catch (error) {
      throw error;
    }
  },
  createPreference: async (items, purpose) => {
    const mypreference = {
      items: items,
      purpose: purpose
    };
    try {
      const response = await preference.create({ body: mypreference });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = PaymentManager;
