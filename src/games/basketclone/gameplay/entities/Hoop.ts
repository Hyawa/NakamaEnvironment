// D:\Nakama\src\games\basketclone\gameplay\entities\Hoop.ts
import { PlayerId } from "./Player";

export interface HoopState {
  x: number;
  y: number;
  width: number;
  height: number;
  scoringPlayerId: PlayerId;
}

export function createHoop(
  x: number,
  y: number,
  width: number,
  height: number,
  scoringPlayerId: PlayerId
): HoopState {
  return {
    x,
    y,
    width,
    height,
    scoringPlayerId,
  };
}