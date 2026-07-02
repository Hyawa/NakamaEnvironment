// D:\Nakama\src\core\helpers\factories.ts
import { createPlayer, PlayerState } from "../../games/basketclone/gameplay/entities/Player";
import { createBall, BallState } from "../../games/basketclone/gameplay/entities/Ball";
import { createHoop, HoopState } from "../../games/basketclone/gameplay/entities/Hoop";
import { createScoreState, ScoreState } from "../../games/basketclone/gameplay/game/ScoreManager";
import { createPossessionState, PossessionState } from "../../games/basketclone/gameplay/game/PossessionManager";
import { GameConfig } from "../../games/basketclone/gameplay/core/GameConfig";
import { GameplayEngine } from "../../games/basketclone/gameplay/GameplayEngine";
import type { GameplayState } from "../../games/basketclone/gameplay/GameplayState";

// ─── Entidades ───────────────────────────────────────────────────────────────
/** Jogador 1 na posição inicial canônica. */
export function createPlayer1(): PlayerState {
  return createPlayer(
    "player1",
    GameConfig.COURT_WIDTH * GameConfig.PLAYER1_START_X_RATIO,
    GameConfig.FLOOR_Y - GameConfig.PLAYER_HEIGHT,
    GameConfig.PLAYER_WIDTH,
    GameConfig.PLAYER_HEIGHT
  );
}

/** Jogador 2 na posição inicial canônica. */
export function createPlayer2(): PlayerState {
  return createPlayer(
    "player2",
    GameConfig.COURT_WIDTH * GameConfig.PLAYER2_START_X_RATIO,
    GameConfig.FLOOR_Y - GameConfig.PLAYER_HEIGHT,
    GameConfig.PLAYER_WIDTH,
    GameConfig.PLAYER_HEIGHT
  );
}

/** Bola livre (sem dono) no centro da quadra. */
export function createFreeBall(): BallState {
  return createBall(350, 200, GameConfig.BALL_RADIUS, null);
}

/** Bola com dono definido. */
export function createHeldBall(holderId: "player1" | "player2"): BallState {
  return createBall(190, 300, GameConfig.BALL_RADIUS, holderId);
}

/** Aros padrão: esquerdo pontua para player2, direito para player1. */
export function createDefaultHoops(): ReadonlyArray<HoopState> {
  return [
    createHoop(20, GameConfig.HOOP_Y, GameConfig.HOOP_WIDTH, GameConfig.HOOP_HEIGHT, "player2"),
    createHoop(
      GameConfig.COURT_WIDTH - 20 - GameConfig.HOOP_WIDTH,
      GameConfig.HOOP_Y,
      GameConfig.HOOP_WIDTH,
      GameConfig.HOOP_HEIGHT,
      "player1"
    ),
  ];
}

/**
 * Bola posicionada dentro do aro esquerdo, indo para baixo.
 * Uma chamada a resolveHoopCollision com vy > 0 deve marcar ponto para player2.
 * Aro esquerdo: x=[20,100], y=[170,184]
 */
export function createBallInsideLeftHoop(): BallState {
  const ball = createBall(60, 177, GameConfig.BALL_RADIUS, null);
  ball.vy = 200;
  return ball;
}

/**
 * Bola posicionada dentro do aro direito, indo para baixo.
 * Uma chamada a resolveHoopCollision com vy > 0 deve marcar ponto para player1.
 * Aro direito: x=[600,680], y=[170,184]
 */
export function createBallInsideRightHoop(): BallState {
  const ball = createBall(640, 177, GameConfig.BALL_RADIUS, null);
  ball.vy = 200;
  return ball;
}

// ─── Managers ────────────────────────────────────────────────────────────────
export function createScoreManager(): ScoreState {
  return createScoreState();
}

export function createPossessionManager(): PossessionState {
  return createPossessionState();
}

// ─── Estado completo ──────────────────────────────────────────────────────────
/** Estado inicial canônico, equivalente ao que Nakama cria em matchInit. */
export function createInitialState(): GameplayState {
  return GameplayEngine.createInitialState();
}