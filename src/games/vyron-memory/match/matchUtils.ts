// =============================================================================
// matchUtils.ts — Vyron Memory
// Funções auxiliares para envio de mensagens (Broadcast)
// =============================================================================

import { MatchState, Opcode, serializeState } from "./matchState";

// Função nomeada clássica (Seguro para o Nakama)
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

// Função nomeada clássica (Seguro para o Nakama)
export function broadcastToAll(
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