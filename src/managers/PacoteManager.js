const { ErrorEnum } = require("../enums/Enums");

const EventoPacotes = [
    // { value: 1, label: '6% de Cada Ingresso - 1000 ingressos 🎟️', purpleCoins: 0, max_ingressos: 1000, },
    { value: 1, label: '0% taxa - 50 ingressos por 1p🟣', purpleCoins: 1, max_ingressos: 50, },
    { value: 2, label: '0% taxa - 100 ingressos por 2p🟣', purpleCoins: 2, max_ingressos: 100, },
    { value: 3, label: '0% taxa - 300 ingressos por 3p🟣', purpleCoins: 2, max_ingressos: 300 },
    { value: 4, label: '0% taxa - 600 ingressos por 5p🟣', purpleCoins: 5, max_ingressos: 600 },
    { value: 5, label: '0% taxa - 2000 ingressos por 10p🟣', purpleCoins: 10, max_ingressos: 2000 },
    { value: 6, label: '0% taxa - 5000 ingressos por 20p🟣', purpleCoins: 20, max_ingressos: 5000 }
];

const CoinsValores = [
    { tipo: 'recarga de purplecoins', id: 1,value: 1, label: '1 PurpleCoin', preco: 120, purpleCoinsCredito: 1, subCoinsCredito: 0},
    { tipo: 'recarga de purplecoins', id: 2,value: 2, label: '3 PurpleCoins', preco: 300, purpleCoinsCredito: 3, subCoinsCredito: 0},
    { tipo: 'recarga de purplecoins', id: 3,value: 3, label: '5 PurpleCoins', preco: 500, purpleCoinsCredito: 5, subCoinsCredito: 0},
    { tipo: 'recarga de purplecoins', id: 4,value: 4, label: '12 PurpleCoins + 50 SubCoins', preco: 1000, purpleCoinsCredito: 12, subCoinsCredito: 50},
    { tipo: 'recarga de purplecoins', id: 5,value: 5, label: '25 PurpleCoins + 150 SubCoins', preco: 2000, purpleCoinsCredito: 25, subCoinsCredito: 150},
    { tipo: 'teste 1 real', id: 6,value: 6, label: '10 SubCoins', preco: 1, purpleCoinsCredito: 0 , subCoinsCredito: 10},
];

const EventoOptionsManager = {
    getEventoPacotes: async () => {
        return EventoPacotes;
    },
    getCoinsValores: async () => {
        return CoinsValores;
    },
    getEventoPacoteByValue: async (pacote) => {
        const pct = EventoPacotes.find(pacote => pacote.value === pacote.value);
        if (!pct || pct.label !== pacote.label || pct.purpleCoins !== pacote.purpleCoins || pct.max_ingressos !== pacote.max_ingressos) {
            throw new Error(ErrorEnum.INVALID_PACOTE_EVENTO);
        }
        return pct;
    },
    getCoinsValorByValue: async (pacote) => {
        const cv = CoinsValores.find(coin => coin.value === pacote.value);
    
        // Verifica se o objeto encontrado é igual ao pacote comparando todas as propriedades
        if (!cv || cv.label !== pacote.label || cv.preco !== pacote.preco || cv.valorAvista !== pacote.valorAvista || cv.tipo !== pacote.tipo) {
            throw new Error(ErrorEnum.INVALID_COIN);
        }
    
        return cv;
    }
}

module.exports = EventoOptionsManager;
