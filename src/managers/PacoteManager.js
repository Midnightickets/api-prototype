const { ErrorEnum } = require("../enums/Enums");

const EventoPacotes = [
    { value: 1, titulo: '6% de Cada Ingresso Start', purpleCoins: 0, max_ingressos: 1000, },
    { value: 2, titulo: '0% de taxa - 100 ingressos por 1 PurpleCoin🟣', purpleCoins: 1, max_ingressos: 100,},
    { value: 3, titulo: '0% de taxa - 200 ingressos por 2 PurpleCoins🟣', purpleCoins: 2, max_ingressos: 200},
    { value: 4, titulo: '0% de taxa - 300 ingressos por 3 PurpleCoins🟣', purpleCoins: 3, max_ingressos: 300},
    { value: 5, titulo: '0% de taxa - 2000 ingressos por 10 PurpleCoins🟣', purpleCoins: 10, max_ingressos: 2000}
];

const CoinsValores = [
    { value: 1, label: '1 PurpleCoin', preco: 120, valorAvista: 120 },
    { value: 3, label: '5 PurpleCoins', preco: 500, valorAvista: 500 },
    { value: 4, label: '10 PurpleCoins', preco: 1000, valorAvista: 900 },
    { value: 5, label: '25 PurpleCoins', preco: 2200, valorAvista: 2000 }
];

const EventoOptionsManager = {
    getEventoPacotes: async () => {
        return EventoPacotes;
    },
    getCoinsValores: async () => {
        return CoinsValores;
    },
    getEventoPacoteByValue: async (value) => {
        const pct = EventoPacotes.find(pacote => pacote.value === value);
        if (!pct) {
            throw new Error(ErrorEnum.INVALID_PACOTE_EVENTO);
        }
        return pct;
    },
    getCoinsValorByValue: async (value) => {
        const cv = CoinsValores.find(coin => coin.value === value);
        if (!cv) {
            throw new Error(ErrorEnum.INVALID_COIN);
        }
        return cv;
    }
}

module.exports = EventoOptionsManager;
