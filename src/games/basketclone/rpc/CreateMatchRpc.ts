// D:\Nakama\src\games\basketclone\rpc\CreateMatchRpc.ts

import { BASKETCLONE_RPC_NAMES, BASKETCLONE_MESSAGES } from '../core/constants/RPCConstants';
import { CreateMatchResponse } from '../core/types/RPCTypes';

export function rpcCreateMatch(
    context: nkruntime.Context,
    logger: nkruntime.Logger,
    nk: nkruntime.Nakama,
    payload: string
): string {
    logger.info(`[${BASKETCLONE_RPC_NAMES.CREATE_MATCH}] Requisição recebida de UserId: ${context.userId}`);

    if (!payload) {
        logger.warn(`[${BASKETCLONE_RPC_NAMES.CREATE_MATCH}] Payload ausente.`);
        throw new Error(BASKETCLONE_MESSAGES.ERROR_INVALID_PAYLOAD);
    }

    try {
        // Valida o payload JSON. 
        // TODO: Importar CreateMatchRequest novamente e atribuir a 'const request = JSON.parse(payload) as CreateMatchRequest;' quando implementar a lógica de matchmaking.
        JSON.parse(payload);

        // TODO: Delegar a lógica real para o módulo de Match/Matchmaking em src/match ou src/matchmaking.
        // Aqui mantemos apenas a infraestrutura da RPC.

        const response: CreateMatchResponse = {
            success: true,
            matchId: "mock-match-id-pendente-de-integracao" 
        };

        return JSON.stringify(response);
    } catch (error) {
        logger.error(`[${BASKETCLONE_RPC_NAMES.CREATE_MATCH}] Erro ao processar: ${(error as Error).message}`);
        throw error;
    }
}

export function registerCreateMatchRpc(initializer: nkruntime.Initializer, logger: nkruntime.Logger): void {
    initializer.registerRpc(BASKETCLONE_RPC_NAMES.CREATE_MATCH, rpcCreateMatch);
    logger?.info(`[RPC Registered] ${BASKETCLONE_RPC_NAMES.CREATE_MATCH}`);
}