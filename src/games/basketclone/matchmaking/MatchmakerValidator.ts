// src/games/basketclone/matchmaking/MatchmakerValidator.ts

import { ValidationResult } from './MatchmakerTypes';
import { logInfo, logError } from './MatchmakerUtils';

export function validateMatchParticipants(
    logger: nkruntime.Logger,
    matches: nkruntime.MatchmakerResult[]
): ValidationResult {
    
    if (!matches || matches.length === 0) {
        logError(logger, "Matchmaker disparado com array de partidas vazio ou nulo.");
        return { isValid: false, error: "Nenhum participante recebido." };
    }

    // Regra arquitetural: O Nakama Matchmaker lida com a lógica de query, 
    // mas validamos o mínimo de jogadores como dupla checagem.
    if (matches.length < 2) {
        logError(logger, "Tentativa de criar partida com menos de 2 jogadores.");
        return { isValid: false, error: "Quantidade insuficiente de jogadores." };
    }

    // Estrutura preparada para expansão:
    // Futuramente, podemos validar se todos os matches possuem MMR compatível
    // ou se o 'mode' (1v1, 5v5) solicitado nos properties não diverge entre os participantes.

    logInfo(logger, "Participantes validados com sucesso.", { playerCount: matches.length });
    
    return { isValid: true };
}