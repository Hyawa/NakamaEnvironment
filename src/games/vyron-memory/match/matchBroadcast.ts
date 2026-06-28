// =============================================================================
// matchBroadcast.ts — Vyron Memory
// Helpers de broadcast isolados em módulo neutro.
//
// Motivação: matchHandler e opcodeHandler precisavam dos mesmos helpers,
// mas opcodeHandler importava matchHandler para acessá-los → dependência
// circular. Extrair para cá quebra o ciclo sem duplicar código.
// =============================================================================

import { Opcode, MatchState, serializeState } from "./matchState";

/**
 * Serializa e envia o MatchState completo para todos os jogadores.
 * Chamado após qualquer mutação de estado.
 */
export function broadcastState(
  dispatcher: nkruntime.MatchDispatcher,
  state: MatchState,
): void {
  dispatcher.broadcastMessage(
    Opcode.MATCH_STATE,
    JSON.stringify(serializeState(state)),
    null,
    null,
    true,
  );
}

/**
 * Envia um opcode arbitrário para uma lista específica de presences.
 * Passa null em presences para broadcast para todos.
 */
export function broadcastTo(
  dispatcher: nkruntime.MatchDispatcher,
  opcode: number,
  payload: object,
  presences: nkruntime.Presence[] | null = null,
): void {
  dispatcher.broadcastMessage(
    opcode,
    JSON.stringify(payload),
    presences,
    null,
    true,
  );
}