// D:\Nakama\src\games\basketclone\gameplay\game\ShotResolver.ts
import { GameConfig } from "../core/GameConfig";
import { PlayerId, FacingDirection } from "../entities/Player";

export type ShotType = "left" | "right" | "high";

export interface ShotInput {
  readonly isLeftPressed: boolean;
  readonly isRightPressed: boolean;
  readonly isJumping: boolean;
}

export interface ThrowVelocity {
  readonly vx: number;
  readonly vy: number;
}

export function resolveShotType(
  input: ShotInput,
  facingDirection: FacingDirection
): ShotType {
  if (input.isJumping) {
    return "high";
  }
  if (input.isRightPressed) {
    return "right";
  }
  if (input.isLeftPressed) {
    return "left";
  }
  return facingDirection;
}

export function computeVelocity(shotType: ShotType, shooterId: PlayerId): ThrowVelocity {
  if (shotType === "right") {
    return { vx: GameConfig.BALL_THROW_VX, vy: GameConfig.BALL_THROW_VY };
  }
  if (shotType === "left") {
    return { vx: -GameConfig.BALL_THROW_VX, vy: GameConfig.BALL_THROW_VY };
  }
  const directionSign = shooterId === "player1" ? 1 : -1;
  return { vx: directionSign * GameConfig.BALL_THROW_HIGH_VX, vy: GameConfig.BALL_THROW_HIGH_VY };
}