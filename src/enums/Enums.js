const SuccessEnum = {
    // EVENTO
    CREATE_EVENTO: 'Evento criado com sucesso',
    CREATE_HOST: 'Host criado com sucesso',
}

const ErrorEnum = {
    // SISTEMA
    SISTEMA_GENERICO: 'Erro no sistema',
    // EVENTO
    REQUIRED_FIELDS: 'Campos obrigatórios não preenchidos',
    EVENTO_TITULO_EXISTENTE: 'Já existe um evento com esse título para esse host',
    // HOST
    HOST_NOT_FOUND: 'Host não encontrado',
    CPF_CNPJ_EXISTENTE: 'Já existe um host com esse CPF/CNPJ',
    LOGIN_EXISTENTE: 'Já existe um host com esse email, login ou telefone',
    // SENHA
    PASSWORD_LENGTH: 'Senha deve ter entre 8 e 20 caracteres',
}

module.exports = {
    SuccessEnum,
    ErrorEnum
}