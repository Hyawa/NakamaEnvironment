import { describe, it, expect } from "vitest";
import { GameConfig } from "../../gameplay/core/GameConfig";

describe("GameConfig", () => {
  describe("quadra", () => {
    it("COURT_WIDTH deve ser 700", () => {
      expect(GameConfig.COURT_WIDTH).toBe(700);
    });

    it("COURT_HEIGHT deve ser 400", () => {
      expect(GameConfig.COURT_HEIGHT).toBe(400);
    });

    it("FLOOR_Y deve ser 360", () => {
      expect(GameConfig.FLOOR_Y).toBe(360);
    });

    it("FLOOR_Y deve estar dentro da quadra", () => {
      expect(GameConfig.FLOOR_Y).toBeLessThanOrEqual(GameConfig.COURT_HEIGHT);
    });
  });

  describe("física", () => {
    it("GRAVITY deve ser positivo (puxa para baixo)", () => {
      expect(GameConfig.GRAVITY).toBeGreaterThan(0);
    });

    it("JUMP_VELOCITY deve ser negativo (impulso para cima)", () => {
      expect(GameConfig.JUMP_VELOCITY).toBeLessThan(0);
    });

    it("GROUND_BOUNCE_DAMPING deve estar entre 0 e 1 (amortecimento)", () => {
      expect(GameConfig.GROUND_BOUNCE_DAMPING).toBeGreaterThan(0);
      expect(GameConfig.GROUND_BOUNCE_DAMPING).toBeLessThan(1);
    });

    it("MIN_BOUNCE_VELOCITY deve ser positivo", () => {
      expect(GameConfig.MIN_BOUNCE_VELOCITY).toBeGreaterThan(0);
    });
  });

  describe("jogador", () => {
    it("PLAYER_WIDTH deve ser positivo", () => {
      expect(GameConfig.PLAYER_WIDTH).toBeGreaterThan(0);
    });

    it("PLAYER_HEIGHT deve ser positivo", () => {
      expect(GameConfig.PLAYER_HEIGHT).toBeGreaterThan(0);
    });

    it("PLAYER_SPEED deve ser positivo", () => {
      expect(GameConfig.PLAYER_SPEED).toBeGreaterThan(0);
    });

    it("PLAYER1_START_X_RATIO deve estar entre 0 e 1", () => {
      expect(GameConfig.PLAYER1_START_X_RATIO).toBeGreaterThan(0);
      expect(GameConfig.PLAYER1_START_X_RATIO).toBeLessThan(1);
    });

    it("PLAYER2_START_X_RATIO deve estar entre 0 e 1", () => {
      expect(GameConfig.PLAYER2_START_X_RATIO).toBeGreaterThan(0);
      expect(GameConfig.PLAYER2_START_X_RATIO).toBeLessThan(1);
    });

    it("player2 começa à direita de player1", () => {
      expect(GameConfig.PLAYER2_START_X_RATIO).toBeGreaterThan(GameConfig.PLAYER1_START_X_RATIO);
    });

    it("jogadores cabem dentro da quadra nas posições iniciais", () => {
      const p1x = GameConfig.COURT_WIDTH * GameConfig.PLAYER1_START_X_RATIO;
      const p2x = GameConfig.COURT_WIDTH * GameConfig.PLAYER2_START_X_RATIO;
      expect(p1x + GameConfig.PLAYER_WIDTH).toBeLessThanOrEqual(GameConfig.COURT_WIDTH);
      expect(p2x + GameConfig.PLAYER_WIDTH).toBeLessThanOrEqual(GameConfig.COURT_WIDTH);
    });
  });

  describe("bola", () => {
    it("BALL_RADIUS deve ser positivo", () => {
      expect(GameConfig.BALL_RADIUS).toBeGreaterThan(0);
    });

    it("BALL_THROW_VX deve ser positivo (velocidade horizontal de arremesso)", () => {
      expect(GameConfig.BALL_THROW_VX).toBeGreaterThan(0);
    });

    it("BALL_THROW_VY deve ser negativo (arremesso sobe)", () => {
      expect(GameConfig.BALL_THROW_VY).toBeLessThan(0);
    });

    it("BALL_THROW_HIGH_VX deve ser positivo", () => {
      expect(GameConfig.BALL_THROW_HIGH_VX).toBeGreaterThan(0);
    });

    it("BALL_THROW_HIGH_VY deve ser negativo (arremesso alto sobe)", () => {
      expect(GameConfig.BALL_THROW_HIGH_VY).toBeLessThan(0);
    });

    it("BALL_RADIUS deve caber dentro da quadra", () => {
      expect(GameConfig.BALL_RADIUS * 2).toBeLessThan(GameConfig.COURT_WIDTH);
      expect(GameConfig.BALL_RADIUS * 2).toBeLessThan(GameConfig.COURT_HEIGHT);
    });
  });

  describe("aro", () => {
    it("HOOP_WIDTH deve ser positivo", () => {
      expect(GameConfig.HOOP_WIDTH).toBeGreaterThan(0);
    });

    it("HOOP_HEIGHT deve ser positivo", () => {
      expect(GameConfig.HOOP_HEIGHT).toBeGreaterThan(0);
    });

    it("HOOP_Y deve estar acima do chão", () => {
      expect(GameConfig.HOOP_Y).toBeLessThan(GameConfig.FLOOR_Y);
    });

    it("HOOP_Y deve estar dentro da quadra (positivo)", () => {
      expect(GameConfig.HOOP_Y).toBeGreaterThan(0);
    });

    it("aros cabem dentro da largura da quadra", () => {
      // aro esquerdo: 20 a 20+HOOP_WIDTH
      // aro direito: COURT_WIDTH - 20 - HOOP_WIDTH a COURT_WIDTH - 20
      expect(20 + GameConfig.HOOP_WIDTH).toBeLessThan(GameConfig.COURT_WIDTH);
      expect(GameConfig.COURT_WIDTH - 20 - GameConfig.HOOP_WIDTH).toBeGreaterThan(0);
    });
  });

  describe("timers e pontuação", () => {
    it("SCORE_POINTS deve ser positivo", () => {
      expect(GameConfig.SCORE_POINTS).toBeGreaterThan(0);
    });

    it("POSSESSION_COOLDOWN_SECONDS deve ser positivo", () => {
      expect(GameConfig.POSSESSION_COOLDOWN_SECONDS).toBeGreaterThan(0);
    });

    it("RESTART_DELAY_SECONDS deve ser positivo", () => {
      expect(GameConfig.RESTART_DELAY_SECONDS).toBeGreaterThan(0);
    });
  });

  describe("existência de todas as propriedades esperadas", () => {
    it("deve ter todas as constantes de física definidas", () => {
      expect(GameConfig.GRAVITY).toBeDefined();
      expect(GameConfig.JUMP_VELOCITY).toBeDefined();
      expect(GameConfig.GROUND_BOUNCE_DAMPING).toBeDefined();
      expect(GameConfig.MIN_BOUNCE_VELOCITY).toBeDefined();
    });

    it("deve ter todas as constantes de jogador definidas", () => {
      expect(GameConfig.PLAYER_WIDTH).toBeDefined();
      expect(GameConfig.PLAYER_HEIGHT).toBeDefined();
      expect(GameConfig.PLAYER_SPEED).toBeDefined();
      expect(GameConfig.PLAYER1_START_X_RATIO).toBeDefined();
      expect(GameConfig.PLAYER2_START_X_RATIO).toBeDefined();
    });

    it("deve ter todas as constantes de arremesso definidas", () => {
      expect(GameConfig.BALL_THROW_VX).toBeDefined();
      expect(GameConfig.BALL_THROW_VY).toBeDefined();
      expect(GameConfig.BALL_THROW_HIGH_VX).toBeDefined();
      expect(GameConfig.BALL_THROW_HIGH_VY).toBeDefined();
    });

    it("deve ter todas as constantes de aro definidas", () => {
      expect(GameConfig.HOOP_WIDTH).toBeDefined();
      expect(GameConfig.HOOP_HEIGHT).toBeDefined();
      expect(GameConfig.HOOP_Y).toBeDefined();
    });
  });
});