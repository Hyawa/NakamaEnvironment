// D:\Nakama\src\games\basketclone\gameplay\game\CollisionManager.ts
import { BallState } from "../entities/Ball";
import { HoopState } from "../entities/Hoop";
import { GameConfig } from "../core/GameConfig";
import { ScoreState, addPoints } from "./ScoreManager";
import { PlayerId } from "../entities/Player";

export function resolveGroundCollision(
  ball: BallState,
  logger: nkruntime.Logger
): void {
  const floorLimit = GameConfig.FLOOR_Y - ball.radius;
  if (ball.y < floorLimit) {
    return;
  }
  ball.y = floorLimit;

  if (Math.abs(ball.vy) > GameConfig.MIN_BOUNCE_VELOCITY) {
    ball.vy = -ball.vy * GameConfig.GROUND_BOUNCE_DAMPING;
    logger.debug("[basketclone:match] Bola colidiu com o chão.");
  } else {
    ball.vy = 0;
  }
}

export function resolveWallCollision(
  ball: BallState,
  logger: nkruntime.Logger
): void {
  if (ball.x - ball.radius <= 0) {
    ball.x = ball.radius;
    ball.vx = -ball.vx * GameConfig.GROUND_BOUNCE_DAMPING;
    logger.debug("[basketclone:match] Bola colidiu com a parede esquerda.");
  }
  if (ball.x + ball.radius >= GameConfig.COURT_WIDTH) {
    ball.x = GameConfig.COURT_WIDTH - ball.radius;
    ball.vx = -ball.vx * GameConfig.GROUND_BOUNCE_DAMPING;
    logger.debug("[basketclone:match] Bola colidiu com a parede direita.");
  }
}

export function resolveHoopCollision(
  ball: BallState,
  hoops: ReadonlyArray<HoopState>,
  scoreState: ScoreState,
  logger: nkruntime.Logger
): PlayerId | null {
  if (ball.vy <= 0) {
    return null;
  }
  for (const hoop of hoops) {
    const isInsideHoop =
      ball.x >= hoop.x &&
      ball.x <= hoop.x + hoop.width &&
      ball.y >= hoop.y &&
      ball.y <= hoop.y + hoop.height;

    if (isInsideHoop) {
      addPoints(scoreState, hoop.scoringPlayerId, GameConfig.SCORE_POINTS);
      logger.info(
        "[basketclone:match] %s marcou %d pontos.",
        hoop.scoringPlayerId,
        GameConfig.SCORE_POINTS
      );
      return hoop.scoringPlayerId;
    }
  }

  return null;
}