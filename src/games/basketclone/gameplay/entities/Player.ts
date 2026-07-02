// D:\Nakama\src\games\basketclone\gameplay\entities\Player.ts
export type PlayerId = "player1" | "player2";
export type FacingDirection = "left" | "right";

export interface PlayerState {
  id: PlayerId;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isGrounded: boolean;
  facingDirection: FacingDirection;
}

export function createPlayer(
  id: PlayerId,
  x: number,
  y: number,
  width: number,
  height: number
): PlayerState {
  return {
    id,
    x,
    y,
    vx: 0,
    vy: 0,
    width,
    height,
    isGrounded: false,
    facingDirection: id === "player1" ? "right" : "left",
  };
}