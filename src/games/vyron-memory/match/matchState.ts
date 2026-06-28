// =============================================================================
// matchState.ts — Vyron Memory
// Estado central do jogo. Único. Imutável pelo client. Gerenciado pelo servidor.
// =============================================================================

// ---------------------------------------------------------------------------
// Opcodes — contrato entre client e servidor
// ---------------------------------------------------------------------------

export const Opcode = {
  // Client → Server
  PLAY_CARD: 1,

  // Server → Client
  MATCH_STATE:   101,
  CARD_FLIPPED:  102,
  PAIR_MATCHED:  103,
  PAIR_MISSED:   104,
  TURN_CHANGED:  105,
  MATCH_OVER:    106,
  PLAYER_JOINED: 107,
  PLAYER_LEFT:   108,
} as const;

export type OpcodeValue = typeof Opcode[keyof typeof Opcode];

// ---------------------------------------------------------------------------
// Tipos de domínio
// ---------------------------------------------------------------------------

export type CardId = string; // formato: "card_<index>"

export interface Card {
  id: CardId;
  pairId: string;   // duas cartas com mesmo pairId formam um par
  faceUp: boolean;
  matched: boolean;
}

export interface Player {
  userId: string;
  username: string;
  score: number;
  presence: nkruntime.Presence;
}

export type MatchStatus = "waiting" | "playing" | "finished";

// ---------------------------------------------------------------------------
// MatchState — a única fonte de verdade
// ---------------------------------------------------------------------------

export interface MatchState {
  // Jogadores conectados
  players: Map<string, Player>;

  // Deck do jogo — gerado e embaralhado pelo servidor
  cards: Map<CardId, Card>;

  // Ordem de turnos
  turnOrder: string[];        // array de userIds em ordem
  currentTurnIndex: number;   // índice no turnOrder

  // Cartas viradas no turno atual (máx. 2)
  flippedThisTurn: CardId[];

  // Progresso
  matchedPairs: number;
  totalPairs: number;

  // Controle de tempo
  turnStartedAt: number;      // timestamp ms

  // Contador de ticks aguardando resolver PAIR_MISSED.
  // Fica no MatchState (e não como variável de módulo) porque cada match
  // tem sua própria instância de estado — variável de módulo seria
  // compartilhada entre todos os matches ativos no mesmo processo.
  noMatchPendingTicks: number;

  // Status geral
  status: MatchStatus;

  // Sessão Nakama
  matchId: string;
}

// ---------------------------------------------------------------------------
// Factory — cria estado inicial limpo
// ---------------------------------------------------------------------------

export function createInitialState(matchId: string, totalPairs: number): MatchState {
  return {
    players:              new Map(),
    cards:                new Map(),
    turnOrder:            [],
    currentTurnIndex:     0,
    flippedThisTurn:      [],
    matchedPairs:         0,
    totalPairs,
    turnStartedAt:        Date.now(),
    noMatchPendingTicks:  0,
    status:               "waiting",
    matchId,
  };
}

// ---------------------------------------------------------------------------
// Helpers de leitura (sem efeito colateral)
// ---------------------------------------------------------------------------

export function getCurrentPlayerId(state: MatchState): string | null {
  if (state.turnOrder.length === 0) return null;
  return state.turnOrder[state.currentTurnIndex % state.turnOrder.length] ?? null;
}

export function isMatchFull(state: MatchState, maxPlayers: number): boolean {
  return state.players.size >= maxPlayers;
}

// ---------------------------------------------------------------------------
// Serialização — converte para JSON seguro para broadcast
// ---------------------------------------------------------------------------

export function serializeState(state: MatchState): object {
  return {
    status:           state.status,
    currentPlayerId:  getCurrentPlayerId(state),
    matchedPairs:     state.matchedPairs,
    totalPairs:       state.totalPairs,
    flippedThisTurn:  state.flippedThisTurn,
    players: Array.from(state.players.values()).map(p => ({
      userId:   p.userId,
      username: p.username,
      score:    p.score,
    })),
    // Apenas cartas visíveis ao client: face up ou matched
    cards: Array.from(state.cards.values()).map(c => ({
      id:      c.id,
      pairId:  c.faceUp || c.matched ? c.pairId : null, // esconde pairId de cartas fechadas
      faceUp:  c.faceUp,
      matched: c.matched,
    })),
  };
}