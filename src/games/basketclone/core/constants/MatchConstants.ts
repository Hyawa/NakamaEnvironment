export const MATCH_CONSTANTS = {
  MODULE_NAME: "basketclone_v1",
  TICK_RATE: 10,
  MAX_PLAYERS: 2,
  MIN_PLAYERS: 2,
  LABEL: "basketclone_v1",
  MATCH_DURATION_MS: 420000, // 7 minutos
  WINNING_SCORE: 12,
};

export enum MatchPhase {
  WAITING_FOR_PLAYERS = "WAITING_FOR_PLAYERS",
  IN_PROGRESS = "IN_PROGRESS",
  FINISHED = "FINISHED",
}