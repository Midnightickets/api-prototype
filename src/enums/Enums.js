const SuccessEnum = {
    // EVENTO
    CREATE_EVENTO: 'Evento criado com sucesso',
    CREATE_HOST: 'Host criado com sucesso',
}

const ErrorEnum = {
    // EVENTO
    CREATE_HOST_GENERIC: 'Já existe um host com esse email, login ou cnpj/cpf',
    EVENTO_TITULO_EXISTENTE: 'Já existe um evento com esse título para esse host',
    // HOST
    HOST_NOT_FOUND: 'Host não encontrado',
    // SENHA
    PASSWORD_REQUIRED: 'Senha é obrigatória',
    PASSWORD_LENGTH: 'Senha deve ter entre 8 e 20 caracteres',
}

module.exports = {
    SuccessEnum,
    ErrorEnum
}