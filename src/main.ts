// D:\Nakama\src\main.ts

import { rpcHealthcheck } from './core/helpers/healthcheck'
import { registerBasketClone } from "./games/basketclone";

function InitModule(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, initializer: nkruntime.Initializer) {
  logger.info("InitModule executado");
  try {
    initializer.registerRpc("rpcHealthcheck", rpcHealthcheck);
    logger.info("RPC registrada");
    registerBasketClone(initializer);
    logger.info("Back end do Jogo BasketClone registrado");
} catch (error) {
    logger.error("Erro ao registrar RPC: %s", error.message);
}
}

(globalThis as any).rpcHealthcheck = rpcHealthcheck;
(globalThis as any).InitModule = InitModule;