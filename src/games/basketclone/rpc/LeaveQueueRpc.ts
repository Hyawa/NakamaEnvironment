// D:\Nakama\src\games\basketclone\rpc\LeaveQueueRpc.ts

import { BASKETCLONE_RPC_NAMES, BASKETCLONE_MESSAGES } from '../core/constants/RPCConstants';
import { LeaveQueueResponse } from '../core/types/RPCTypes';

export function rpcLeaveQueue(
    context: nkruntime.Context,
    logger: nkruntime.Logger,
    nk: nkruntime.Nakama,
    payload: string
): string {
    logger.info(`[${BASKETCLONE_RPC_NAMES.LEAVE_QUEUE}] Requisição recebida de UserId: ${context.userId}`);

    if (!payload) {
        logger.warn(`[${BASKETCLONE_RPC_NAMES.LEAVE_QUEUE}] Payload ausente.`);
        throw new Error(BASKETCLONE_MESSAGES.ERROR_INVALID_PAYLOAD);
    }

    try {
        // Valida o payload JSON.
        // TODO: Importar LeaveQueueRequest novamente e atribuir a 'const request = JSON.parse(payload) as LeaveQueueRequest;' quando implementar a lógica de remoção.
        JSON.parse(payload);

        // TODO: Delegar a lógica de remoção da fila para o módulo de Matchmaking.

        const response: LeaveQueueResponse = {
            success: true
        };

        return JSON.stringify(response);
    } catch (error) {
        logger.error(`[${BASKETCLONE_RPC_NAMES.LEAVE_QUEUE}] Erro ao processar: ${(error as Error).message}`);
        throw error;
    }
}

export function registerLeaveQueueRpc(initializer: nkruntime.Initializer, logger: nkruntime.Logger): void {
    initializer.registerRpc(BASKETCLONE_RPC_NAMES.LEAVE_QUEUE, rpcLeaveQueue);
    logger?.info(`[RPC Registered] ${BASKETCLONE_RPC_NAMES.LEAVE_QUEUE}`);
}