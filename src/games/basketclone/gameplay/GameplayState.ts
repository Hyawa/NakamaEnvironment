// D:\Nakama\src\games\basketclone\gameplay\GameplayState.ts
import { PlayerState, PlayerId } from "./entities/Player";
import { BallState } from "./entities/Ball";
import { HoopState } from "./entities/Hoop";
import { ScoreState } from "./game/ScoreManager";
import { PossessionState } from "./game/PossessionManager";
import { PlayerInputState } from "./PlayerInput";
import { MatchPhase } from "../core/constants/MatchConstants";

export interface GameplayState {
  player1: PlayerState;
  player2: PlayerState;
  ball: BallState;
  hoops: ReadonlyArray<HoopState>;
  score: ScoreState;
  possession: PossessionState;
  roleByUserId: { [userId: string]: PlayerId };
  input: { player1: PlayerInputState; player2: PlayerInputState };
  previousInput: { player1: PlayerInputState; player2: PlayerInputState };
  isPaused: boolean;
  restartTimerSeconds: number;
  pendingConcededPlayerId: PlayerId | null;
  matchTimeMs: number;
  phase: MatchPhase;
  winner: PlayerId | null;
}