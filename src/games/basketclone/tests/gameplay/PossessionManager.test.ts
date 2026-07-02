// D:\Nakama\src\games\basketclone\tests\gameplay\PossessionManager.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { createPossessionState, resolvePossession, startReleaseCooldown, PossessionState } from '../../gameplay/game/PossessionManager';
import { createBall, BallState } from '../../gameplay/entities/Ball';
import { createPlayer, PlayerState } from '../../gameplay/entities/Player';
import { GameConfig } from '../../gameplay/core/GameConfig';

describe('PossessionManager - Prevenção de Regressões', () => {
  let possessionState: PossessionState;
  let ball: BallState;
  let player1: PlayerState;
  let player2: PlayerState;
  let mockLogger: any;

  beforeEach(() => {
    try {
      possessionState = createPossessionState();
      ball = createBall(100, 100, 10, null);
      player1 = createPlayer("player1", 50, 200, 40, 80);
      player2 = createPlayer("player2", 200, 200, 40, 80);
      mockLogger = {
        debug: () => {},
        info: () => {},
        warn: () => {},
        error: () => {}
      };
    } catch (error) {
      console.error('[PossessionManager.test] Falha na inicialização. Contexto: Setup beforeEach.', {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  });

  it('deve gerar o estado inicial corretamente (dados puros)', () => {
    expect(possessionState).toBeDefined();
    expect(possessionState.cooldownSeconds).toBe(0);
  });

  it('CRÍTICO: deve possuir a função resolvePossession', () => {
    expect(resolvePossession).toBeDefined();
    expect(typeof resolvePossession).toBe('function');
  });

  it('deve possuir a função startReleaseCooldown', () => {
    expect(startReleaseCooldown).toBeDefined();
    expect(typeof startReleaseCooldown).toBe('function');
  });

  it('startReleaseCooldown deve setar cooldown para POSSESSION_COOLDOWN_SECONDS', () => {
    startReleaseCooldown(possessionState);
    expect(possessionState.cooldownSeconds).toBe(GameConfig.POSSESSION_COOLDOWN_SECONDS);
  });

  it('resolvePossession deve decrementar cooldown quando positivo', () => {
    possessionState.cooldownSeconds = 1.0;
    resolvePossession(possessionState, ball, player1, player2, 0.5, mockLogger);
    expect(possessionState.cooldownSeconds).toBeCloseTo(0.5);
  });

  it('resolvePossession deve permitir pickup quando bola está livre e cooldown é 0', () => {
    ball.holderId = null;
    ball.x = player1.x + player1.width / 2;
    ball.y = player1.y + player1.height / 2;
    possessionState.cooldownSeconds = 0;

    resolvePossession(possessionState, ball, player1, player2, 0.016, mockLogger);
    expect(ball.holderId).toBe("player1");
  });
});