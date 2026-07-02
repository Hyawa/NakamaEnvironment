// D:\Nakama\src\core\helpers\healthcheck.ts

export const rpcHealthcheck: nkruntime.RpcFunction = (
    ctx,
    logger,
    nk,
    payload
): string => {
    logger.info("healthcheck");

    return JSON.stringify({
        success: true,
    });
};