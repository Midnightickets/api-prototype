const EventoManager = require('./EventoManager');
const { IngressoPayment: IngressoPaymentModel } = require("../models/IngressoPayment");
const { MercadoPagoConfig, Preference } = require("mercadopago");
const HostManager = require('./HostManager');

// const client = new MercadoPagoConfig({
//   accessToken: process.env.PROD_ACCESS_TOKEN,
// });
// const preference = new Preference(client);
// const payment = new mercadopago.Payment(client);

const IngressoManager = {
    configPreference: async (hostId) => {
        const client = new MercadoPagoConfig({
          accessToken: await HostManager.getAKMercadoPagoByHost(hostId),
        });
        return new Preference(client);
      },
    createPreference: async (reqBody) => {
        try {
          const eventoValid = await EventoManager.buscarEventoPublico({id: reqBody.eventoId});
          let ingressoValid = {}
          let ingressoBoolean = false;
          eventoValid.tipos_ingressos.forEach((tipo) => {
            if (tipo.titulo.trim().toUpperCase() === reqBody.ingresso.titulo.trim().toUpperCase()) {
              ingressoValid = tipo;
              ingressoBoolean = true;
              return;
            }
          });
          if(!ingressoBoolean) {
            throw new Error('Ingresso não encontrado');
          }
          const ingressoPayment = {
            preference_id: '',
            payment_id: '',
            usuario: reqBody.usuario.id,
            evento: eventoValid.id,
            status: 'intention.created',
            ingresso: ingressoValid,
          };
          const ingressoPaymentCreated = await IngressoPaymentModel.create(ingressoPayment).catch((error) => { console.log(error); throw new Error(error); });

          reqBody.items[0].description = ingressoPaymentCreated._id;
          const hostValid = await HostManager.getHostIdByEvento(eventoValid.id)
          const preference = await IngressoManager.configPreference(hostValid).catch((error) => { console.log(error); throw new Error(error); });
          const response = await preference.create({ body: reqBody })
          .catch((error) => { console.log(error) })
          
          ingressoPaymentCreated.preference_id = response.id;
          await ingressoPaymentCreated.save().catch((error) => { console.log(error); throw new Error(error); });
    
          return response.id;
        } catch (error) {
          throw error;
        }
      },

}

module.exports = IngressoManager;