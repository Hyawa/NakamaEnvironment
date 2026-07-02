// D:\Nakama\src\games\basketclone\gameplay\game\ScoreManager.ts
import { PlayerId } from "../entities/Player";

export interface ScoreState {
  player1: number;
  player2: number;
}

export function createScoreState(): ScoreState {
  return {
    player1: 0,
    player2: 0,
  };
}

export function addPoints(state: ScoreState, playerId: PlayerId, points: number): void {
  if (playerId === "player1") {
    state.player1 += points;
    return;
  }
  state.player2 += points;
}

export function resetScore(state: ScoreState): void {
  state.player1 = 0;
  state.player2 = 0;
}