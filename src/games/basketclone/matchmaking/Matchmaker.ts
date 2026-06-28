// D:\Nakama\src\games\basketclone\matchmaking\Matchmaker.ts

import { validateMatchParticipants } from './MatchmakerValidator';
import { createAuthoritativeMatch } from './MatchCreator';
import { logInfo, logError } from './MatchmakerUtils';

export function onMatchmakerMatched(
    ctx: nkruntime.Context,
    logger: nkruntime.Logger,
    nk: nkruntime.Nakama,
    matches: nkruntime.MatchmakerResult[]
): string {
    try {
        logInfo(logger, "Matchmaker encontrou jogadores compatíveis.", { count: matches.length });

        const validation = validateMatchParticipants(logger, matches);
        
        if (!validation.isValid) {
            logError(logger, `Match abortado devido a falha na validação: ${validation.error}`);
            return ""; // Interrompe o processo e devolve os jogadores para a fila
        }

        const matchId = createAuthoritativeMatch(ctx, logger, nk, matches);

        if (!matchId || matchId.trim() === "") {
            logInfo(logger, "MatchCreator não retornou um MatchId válido. Matchmakers notificados sobre cancelamento.");
            return "";
        }

        return matchId;

    } catch (error) {
        logError(logger, "Exceção não tratada na raiz do callback onMatchmakerMatched.", error);
        return "";
    }
}

export function registerMatchmakerMatched(initializer: nkruntime.Initializer){
    initializer.registerMatchmakerMatched(onMatchmakerMatched);
}