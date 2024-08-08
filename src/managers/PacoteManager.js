const { ErrorEnum } = require("../enums/Enums");

const EventoPacotes = [
    // { value: 1, label: '6% de Cada Ingresso - 1000 ingressos 🎟️', purpleCoins: 0, max_ingressos: 1000, },
    { value: 1, label: '0% taxa - 50 ingressos por 1 PurpleCoin🟣', purpleCoins: 1, max_ingressos: 50, },
    { value: 2, label: '0% taxa - 100 ingressos por 2 PurpleCoins🟣', purpleCoins: 2, max_ingressos: 100, },
    { value: 3, label: '0% taxa - 300 ingressos por 3 PurpleCoins🟣', purpleCoins: 2, max_ingressos: 300 },
    { value: 4, label: '0% taxa - 600 ingressos por 5 PurpleCoins🟣', purpleCoins: 5, max_ingressos: 600 },
    { value: 5, label: '0% taxa - 2000 ingressos por 10 PurpleCoins🟣', purpleCoins: 10, max_ingressos: 2000 },
    { value: 6, label: '0% taxa - 5000 ingressos por 20 PurpleCoins🟣', purpleCoins: 20, max_ingressos: 5000 }
];

const CoinsValores = [
    { value: 1, label: '1 PurpleCoin', preco: 80, valorAvista: 80 },
    { value: 2, label: '3 PurpleCoins', preco: 300, valorAvista: 300 },
    { value: 3, label: '5 PurpleCoins', preco: 500, valorAvista: 500 },
    { value: 4, label: '12 PurpleCoins', preco: 1000, valorAvista: 1000 },
    { value: 5, label: '25 PurpleCoins', preco: 2000, valorAvista: 2000 }
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
