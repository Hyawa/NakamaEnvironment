/**
 * Cópia 1:1 de src/core/Physics.ts (client/SinglePlayer).
 * Puramente matemático — sem nenhuma alteração para o servidor.
 */
import { GameConfig } from "./GameConfig";

export interface Movable {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export class Physics {
  private constructor() {}

  public static applyGravity(entity: Movable, deltaSeconds: number): void {
    entity.vy += GameConfig.GRAVITY * deltaSeconds;
  }

  public static integrate(entity: Movable, deltaSeconds: number): void {
    entity.x += entity.vx * deltaSeconds;
    entity.y += entity.vy * deltaSeconds;
  }

  public static clampHorizontal(entity: Movable, minX: number, maxX: number): void {
    if (entity.x < minX) {
      entity.x = minX;
      entity.vx = 0;
    }
    if (entity.x > maxX) {
      entity.x = maxX;
      entity.vx = 0;
    }
  }
}
