// D:\Nakama\src\games\basketclone\rpc\Constants.ts

export const BASKETCLONE_RPC_NAMES = {
    HEALTHCHECK: 'basketclone_healthcheck',
    GET_VERSION: 'basketclone_get_version',
    CREATE_MATCH: 'basketclone_create_match',
    LEAVE_QUEUE: 'basketclone_leave_queue',
    PING: 'basketclone_ping',
} as const;

export const BASKETCLONE_MESSAGES = {
    ERROR_INVALID_PAYLOAD: 'O payload da requisição é inválido ou está ausente.',
    ERROR_INTERNAL: 'Ocorreu um erro interno no servidor.',
    SUCCESS_HEALTHCHECK: 'BasketClone module is running smoothly.',
} as const;

export const BASKETCLONE_CONFIG = {
    VERSION: '1.0.0', // Versão da infraestrutura do BasketClone
} as const;