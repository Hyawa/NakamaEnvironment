// D:\Nakama\src\games\basketclone\gameplay\game\PossessionManager.ts
import { BallState } from "../entities/Ball";
import { PlayerState } from "../entities/Player";
import { GameConfig } from "../core/GameConfig";

export interface PossessionState {
  cooldownSeconds: number;
}

export function createPossessionState(): PossessionState {
  return {
    cooldownSeconds: 0,
  };
}

export function resolvePossession(
  state: PossessionState,
  ball: BallState,
  player1: PlayerState,
  player2: PlayerState,
  deltaSeconds: number,
  logger: nkruntime.Logger
): void {
  try {
    if (state.cooldownSeconds > 0) {
      state.cooldownSeconds -= deltaSeconds;
    }

    if (ball.holderId === null) {
      if (state.cooldownSeconds <= 0) {
        tryPickupFreeBall(state, ball, [player1, player2], logger);
      }
      return;
    }

    if (state.cooldownSeconds <= 0) {
      trySteal(state, ball, player1, player2, logger);
    }
  } catch (error) {
    logger.error(
      `[PossessionManager.resolvePossession] Erro na resolução de posse de bola. Erro: ${error instanceof Error ? error.message : String(error)}`,
      { error }
    );
    throw error;
  }
}

export function startReleaseCooldown(state: PossessionState): void {
  state.cooldownSeconds = GameConfig.POSSESSION_COOLDOWN_SECONDS;
}

function tryPickupFreeBall(
  state: PossessionState,
  ball: BallState,
  players: ReadonlyArray<PlayerState>,
  logger: nkruntime.Logger
): void {
  for (const player of players) {
    if (isBallOverlappingPlayer(ball, player)) {
      assignPossession(state, ball, player, logger);
      return;
    }
  }
}

function trySteal(
  state: PossessionState,
  ball: BallState,
  player1: PlayerState,
  player2: PlayerState,
  logger: nkruntime.Logger
): void {
  const holder = ball.holderId === player1.id ? player1 : player2;
  const challenger = ball.holderId === player1.id ? player2 : player1;
  if (isPlayerOverlappingPlayer(holder, challenger)) {
    logger.info("[basketclone:match] %s roubou a bola de %s.", challenger.id, holder.id);
    assignPossession(state, ball, challenger, logger);
  }
}

function assignPossession(
  state: PossessionState,
  ball: BallState,
  player: PlayerState,
  logger: nkruntime.Logger
): void {
  const isNewPossession = ball.holderId !== player.id;
  ball.holderId = player.id;
  ball.vx = 0;
  ball.vy = 0;
  state.cooldownSeconds = GameConfig.POSSESSION_COOLDOWN_SECONDS;
  if (isNewPossession) {
    logger.debug("[basketclone:match] %s está com a bola.", player.id);
  }
}

function isBallOverlappingPlayer(ball: BallState, player: PlayerState): boolean {
  const closestX = Math.max(player.x, Math.min(ball.x, player.x + player.width));
  const closestY = Math.max(player.y, Math.min(ball.y, player.y + player.height));
  const distanceX = ball.x - closestX;
  const distanceY = ball.y - closestY;
  return distanceX * distanceX + distanceY * distanceY <= ball.radius * ball.radius;
}

function isPlayerOverlappingPlayer(a: PlayerState, b: PlayerState): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}