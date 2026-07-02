// D:\Nakama\src\games\basketclone\match\MatchState.ts

import { MatchPhase } from "../core/constants/MatchConstants";
import { PlayerInfo } from "../core/types/MatchTypes";
import { GameplayState } from "../gameplay/GameplayState";

/**
 * Estado do match do basketclone.
 *
 * `players` é a informação de conexão/infraestrutura (presence,
 * conectado, papel atribuído). `gameplay` é a simulação em si
 * (jogadores, bola, cestas, placar) — ver gameplay/GameplayState.ts.
 * Mantidos separados de propósito: conexão e simulação têm ciclos
 * de vida e responsabilidades diferentes.
 */
export interface BasketCloneMatchState extends nkruntime.MatchState {
  phase: MatchPhase;
  tick: number;
  matchTimeMs: number;
  players: { [userId: string]: PlayerInfo };
  gameplay: GameplayState;
}