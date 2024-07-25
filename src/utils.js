const { ErrorEnum } = require("./enums/Enums");

const Utils = {
    validaCPF: async (cpf) => {
        // Remove caracteres não numéricos
        const cpfClean = cpf.replace(/[^\d]/g, '');

        // Verifica se o CPF tem 11 dígitos
        if (cpfClean.length !== 11) throw new Error(ErrorEnum.CPF_INVALIDO);

        // Função para calcular o dígito verificador
        const calcDigit = (cpf, factor) => {
            let total = 0;
            for (let i = 0; i < factor - 1; i++) {
                total += cpf[i] * (factor - i);
            }
            const remainder = (total * 10) % 11;
            return remainder === 10 ? 0 : remainder;
        };

        // Verifica o primeiro dígito
        const digit1 = calcDigit(cpfClean, 10);
        if (digit1 !== parseInt(cpfClean[9])) throw new Error(ErrorEnum.CPF_INVALIDO);

        // Verifica o segundo dígito
        const digit2 = calcDigit(cpfClean, 11);
        if (digit2 !== parseInt(cpfClean[10])) throw new Error(ErrorEnum.CPF_INVALIDO);

        return true;
    }
}

module.exports = Utils;
