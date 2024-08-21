const SuccessEnum = {
    // HOST
    LOGIN_SUCCESS: 'Login realizado com sucesso',
    SUBCOINS_TRANSFORMED: 'SubCoins transformados em PurpleCoins com sucesso',
    // EVENTO
    CREATE_EVENTO: 'Evento criado com sucesso',
    CREATE_HOST: 'Host criado com sucesso',
    UPDATED_EVENTO: 'Evento atualizado com sucesso',
    UPDATED_LOTE_INGRESSO: 'Lote de ingressos atualizado com sucesso',
    CANCELED_EVENTO: 'Evento Cancelado com sucesso',
}

const ErrorEnum = {
    // SISTEMA
    SISTEMA_GENERICO: 'Erro no sistema',
    CREATE_EVENTO_GENERIC: 'Erro ao validar evento',
    LOGIN_ERROR: 'Erro no login',
    REQUIRED_FIELDS: 'Campos obrigatórios não preenchidos',
    ERROR_FINDING_PAYMENTS: 'Erro ao buscar pagamentos',
    // EVENTO
    EVENTO_TITULO_EXISTENTE: 'Você já possui um Evento Ativo com esse Título',
    INVALID_SUBHOSTS: 'Subhosts inválidos',
    INVALID_TIPOS_INGRESSOS: 'Tipos de ingressos inválidos',
    INVALID_QTD_INGRESSOS: 'Quantidade de ingressos inválida',
    INVALID_LOCALIZACAO: 'Localização inválida',
    EVENTO_NOT_FOUND: 'Evento não encontrado',
    UPDATE_EVENTO: 'Campos Obrigatórios não preenchidos ou Título já Existente em outro Evento seu',
    INVALID_DATA_EVENTO: 'A Data do Evento não pode ser anterior a data atual',
    EVENTO_INDISPONIVEL: 'Evento indisponível',
    UPDATE_LOTE_INGRESSO: 'Lote de ingressos inválidos',
    // HOST
    HOST_NOT_FOUND: 'Host não encontrado',
    CPF_CNPJ_EXISTENTE: 'Já existe um host com esse CPF/CNPJ',
    CPF_CNPJ_INVALIDO: 'CPF/CNPJ inválido',
    LOGIN_EXISTENTE: 'Já existe um host com esse email, login ou telefone',
    ACCESS_PEOPLE_NOT_FOUND: 'Acessos não encontrados',
    ACCESS_PEOPLE_EXISTENTE: 'Acesso já existente',
    SUBCOINS_INSUFICIENTE: 'Saldo de SubCoins insuficiente',
    // SENHA
    PASSWORD_LENGTH: 'Senha deve ter entre 8 e 20 caracteres',
    INCORRECT_PASSWORD: 'Senha incorreta',
    // UTILS
    CPF_INVALIDO: 'CPF inválido',
    INVALID_EMAIL: 'Email inválido',
    // PACOTE
    INVALID_PACOTE_EVENTO: 'Pacote de ingressos inválido',
    INVALID_COIN: 'Moeda virtual inválida',
    PURPLECOINS_INSUFICIENTE: 'Saldo de PurpleCoins insuficiente',
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