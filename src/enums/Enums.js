const SuccessEnum = {
    // HOST
    LOGIN_SUCCESS: 'Login realizado com sucesso',
    // EVENTO
    CREATE_EVENTO: 'Evento criado com sucesso',
    CREATE_HOST: 'Host criado com sucesso',
    EVENTO_ATUALIZADO: 'Evento atualizado com sucesso',
}

const ErrorEnum = {
    // SISTEMA
    SISTEMA_GENERICO: 'Erro no sistema',
    CREATE_EVENTO_GENERIC: 'Erro ao validar evento',
    LOGIN_ERROR: 'Erro no login',
    REQUIRED_FIELDS: 'Campos obrigatórios não preenchidos',
    // EVENTO
    EVENTO_TITULO_EXISTENTE: 'Você já possui um Evento com esse título',
    INVALID_SUBHOSTS: 'Subhosts inválidos',
    INVALID_TIPOS_INGRESSOS: 'Tipos de ingressos inválidos',
    INVALID_QTD_INGRESSOS: 'Quantidade de ingressos inválida',
    INVALID_LOCALIZACAO: 'Localização inválida',
    EVENTO_NOT_FOUND: 'Evento não encontrado',
    // HOST
    HOST_NOT_FOUND: 'Host não encontrado',
    CPF_CNPJ_EXISTENTE: 'Já existe um host com esse CPF/CNPJ',
    LOGIN_EXISTENTE: 'Já existe um host com esse email, login ou telefone',
    // SENHA
    PASSWORD_LENGTH: 'Senha deve ter entre 8 e 20 caracteres',
    INCORRECT_PASSWORD: 'Senha incorreta',
    // UTILS
    CPF_INVALIDO: 'CPF inválido',
    INVALID_EMAIL: 'Email inválido',
    // PACOTE
    INVALID_PACOTE_EVENTO: 'Pacote de ingressos inválido',
    INVALID_COIN: 'Moeda virtual inválida',
    PURPLECOINS_INSUFICIENTE: 'Saldo de PurpleCoins insuficiente'
}

const StatusEnum = {
    // EVENTO
    PENDENTE: '🟡 Pendente',
    EM_ANDAMENTO: '🟢 Em andamento',
    FINALIZADO: '🟣 Finalizado',
    CANCELADO: '🔴 Cancelado'
}

module.exports = {
    SuccessEnum,
    ErrorEnum,
    StatusEnum
}