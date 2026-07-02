// D:\Nakama\src\games\basketclone\gameplay\entities\Ball.ts
import { PlayerId } from "./Player";

export interface BallState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  holderId: PlayerId | null;
}

export function createBall(
  x: number,
  y: number,
  radius: number,
  holderId: PlayerId | null = null
): BallState {
  return {
    x,
    y,
    vx: 0,
    vy: 0,
    radius,
    holderId,
  };
}