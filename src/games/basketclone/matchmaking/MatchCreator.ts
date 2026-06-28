// src/games/basketclone/matchmaking/MatchCreator.ts

import { logInfo, logError } from './MatchmakerUtils';

export function createAuthoritativeMatch(
    ctx: nkruntime.Context,
    logger: nkruntime.Logger,
    nk: nkruntime.Nakama,
    matches: nkruntime.MatchmakerResult[]
): string {
    try {
        logInfo(logger, "Delegando criação para o módulo de Match...");

        // =========================================================================
        // PREPARAÇÃO PARA A FASE 4 (Lógica Autoritativa)
        // O código abaixo será ativado quando o módulo "match/" for implementado.
        // =========================================================================
        
        // const moduleName = "basketball_match_loop"; 
        // const matchId = nk.matchCreate(moduleName, { participants: matches });
        // logInfo(logger, `Partida criada com sucesso. MatchId gerado: ${matchId}`);
        // return matchId;

        logInfo(logger, "Módulo de partida ainda não implementado. Retornando recusa graciosa.");
        
        // Decisão Arquitetural: 
        // O Nakama exige uma string vazia ("") para rejeitar/cancelar um match com segurança.
        // Retornar um texto qualquer (ex: "placeholder_id") causa crash de parse no engine interno do Nakama.
        return "";

    } catch (error) {
        logError(logger, "Falha crítica ao executar nk.matchCreate().", error);
        // Em caso de quebra inesperada, devolve string vazia para abortar a inicialização.
        return ""; 
    }
}