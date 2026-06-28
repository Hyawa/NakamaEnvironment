// src/games/basketclone/matchmaking/MatchmakerUtils.ts

export function logInfo(logger: nkruntime.Logger, message: string, data?: any): void {
    const payload = data ? JSON.stringify(data) : "";
    logger.info(`[Matchmaking] ${message} ${payload}`);
}

export function logError(logger: nkruntime.Logger, message: string, error?: any): void {
    const payload = error ? JSON.stringify(error) : "";
    logger.error(`[Matchmaking] ERRO: ${message} ${payload}`);
}