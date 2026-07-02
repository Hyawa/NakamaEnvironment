// D:\Nakama\src\main.ts

import { rpcHealthcheck } from "./core/helpers/healthcheck";

// BasketClone
import { onMatchmakerMatched } from "./games/basketclone/matchmaking/onMatchmakerMatched";

import { MATCH_CONSTANTS } from "./games/basketclone/core/constants/MatchConstants";

import {
    matchInit,
    matchJoinAttempt,
    matchJoin,
    matchLeave,
    matchLoop,
    matchSignal,
    matchTerminate,
} from "./games/basketclone/match/Match";

import { BASKETCLONE_RPC_NAMES } from "./games/basketclone/core/constants/RPCConstants";

import { rpcCreateMatch } from "./games/basketclone/rpc/CreateMatchRpc";
import { rpcLeaveQueue } from "./games/basketclone/rpc/LeaveQueueRpc";

function InitModule(
    ctx: nkruntime.Context,
    logger: nkruntime.Logger,
    nk: nkruntime.Nakama,
    initializer: nkruntime.Initializer
) {
    logger.info("Inicializando servidor...");

    try {
        logger.info("Registrando RPCs globais...");
        initializer.registerRpc("rpcHealthcheck", rpcHealthcheck);
        logger.info("RPCs globais registradas.");
    } catch (error) {
        logger.error(`Erro ao registrar RPCs Globais: ${(error as Error).message}`);
        throw error;
    }

    try {
        logger.info("Registrando BasketClone...");

        initializer.registerMatchmakerMatched(onMatchmakerMatched);

        initializer.registerMatch(MATCH_CONSTANTS.MODULE_NAME, {
            matchInit,
            matchJoinAttempt,
            matchJoin,
            matchLeave,
            matchLoop,
            matchSignal,
            matchTerminate,
        });

        initializer.registerRpc(BASKETCLONE_RPC_NAMES.CREATE_MATCH, rpcCreateMatch);
        initializer.registerRpc(BASKETCLONE_RPC_NAMES.LEAVE_QUEUE, rpcLeaveQueue);

        logger.info("BasketClone registrado com sucesso.");
    } catch (error) {
        logger.error(`Erro ao registrar BasketClone: ${(error as Error).message}`);
        throw error;
    }

    logger.info("Servidor inicializado com sucesso.");
}

(globalThis as any).InitModule = InitModule;