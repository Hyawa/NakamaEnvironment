import { describe, it, expect, beforeEach } from "vitest";
import { Physics, Movable } from "../../gameplay/core/Physics";
import { GameConfig } from "../../gameplay/core/GameConfig";

const DT = 1 / 60; // delta de um tick a 60fps

function createMovable(x = 0, y = 0, vx = 0, vy = 0): Movable {
  return { x, y, vx, vy };
}

describe("Physics", () => {
  describe("applyGravity", () => {
    let entity: Movable;

    beforeEach(() => {
      entity = createMovable(0, 0, 0, 0);
    });

    it("aumenta vy por GRAVITY * deltaSeconds", () => {
      Physics.applyGravity(entity, DT);
      expect(entity.vy).toBeCloseTo(GameConfig.GRAVITY * DT);
    });

    it("acumula gravidade em múltiplos ticks", () => {
      for (let i = 0; i < 10; i++) {
        Physics.applyGravity(entity, DT);
      }
      expect(entity.vy).toBeCloseTo(GameConfig.GRAVITY * DT * 10);
    });

    it("não altera x", () => {
      entity = createMovable(100, 200, 50, 30);
      Physics.applyGravity(entity, DT);
      expect(entity.x).toBe(100);
    });

    it("não altera y", () => {
      entity = createMovable(100, 200, 50, 30);
      Physics.applyGravity(entity, DT);
      expect(entity.y).toBe(200);
    });

    it("não altera vx", () => {
      entity = createMovable(100, 200, 50, 30);
      Physics.applyGravity(entity, DT);
      expect(entity.vx).toBe(50);
    });

    it("com deltaSeconds = 0, não altera vy", () => {
      entity = createMovable(0, 0, 0, 10);
      Physics.applyGravity(entity, 0);
      expect(entity.vy).toBe(10);
    });

    it("funciona com vy negativo (entidade subindo)", () => {
      entity = createMovable(0, 0, 0, -480);
      Physics.applyGravity(entity, DT);
      expect(entity.vy).toBeCloseTo(-480 + GameConfig.GRAVITY * DT);
    });
  });

  describe("integrate", () => {
    let entity: Movable;

    beforeEach(() => {
      entity = createMovable(0, 0, 100, 200);
    });

    it("move x por vx * deltaSeconds", () => {
      Physics.integrate(entity, DT);
      expect(entity.x).toBeCloseTo(100 * DT);
    });

    it("move y por vy * deltaSeconds", () => {
      Physics.integrate(entity, DT);
      expect(entity.y).toBeCloseTo(200 * DT);
    });

    it("não altera vx", () => {
      Physics.integrate(entity, DT);
      expect(entity.vx).toBe(100);
    });

    it("não altera vy", () => {
      Physics.integrate(entity, DT);
      expect(entity.vy).toBe(200);
    });

    it("com velocidade negativa, move para esquerda e cima", () => {
      entity = createMovable(100, 100, -50, -30);
      Physics.integrate(entity, DT);
      expect(entity.x).toBeLessThan(100);
      expect(entity.y).toBeLessThan(100);
    });

    it("com deltaSeconds = 0, não move", () => {
      entity = createMovable(50, 80, 300, 400);
      Physics.integrate(entity, 0);
      expect(entity.x).toBe(50);
      expect(entity.y).toBe(80);
    });

    it("acumula posição em múltiplos ticks", () => {
      entity = createMovable(0, 0, 60, 0);
      for (let i = 0; i < 60; i++) {
        Physics.integrate(entity, DT);
      }
      // 60 pixels/s * 1 segundo = 60 pixels
      expect(entity.x).toBeCloseTo(60, 1);
    });
  });

  describe("clampHorizontal", () => {
    it("não altera entity dentro dos limites", () => {
      const entity = createMovable(100, 0, 50, 0);
      Physics.clampHorizontal(entity, 0, 200);
      expect(entity.x).toBe(100);
      expect(entity.vx).toBe(50);
    });

    it("quando x < minX: seta x para minX e zera vx", () => {
      const entity = createMovable(-10, 0, -100, 0);
      Physics.clampHorizontal(entity, 0, 200);
      expect(entity.x).toBe(0);
      expect(entity.vx).toBe(0);
    });

    it("quando x > maxX: seta x para maxX e zera vx", () => {
      const entity = createMovable(300, 0, 100, 0);
      Physics.clampHorizontal(entity, 0, 200);
      expect(entity.x).toBe(200);
      expect(entity.vx).toBe(0);
    });

    it("exatamente em minX: não aciona clamp (x < minX é false)", () => {
      const entity = createMovable(0, 0, -10, 0);
      Physics.clampHorizontal(entity, 0, 200);
      expect(entity.x).toBe(0);
      expect(entity.vx).toBe(-10); // sem clamp; x não é < minX
    });

    it("exatamente em maxX: não aciona clamp (x > maxX é false)", () => {
      const entity = createMovable(200, 0, 10, 0);
      Physics.clampHorizontal(entity, 0, 200);
      expect(entity.x).toBe(200);
      expect(entity.vx).toBe(10); // sem clamp; x não é > maxX
    });

    it("não altera y ou vy", () => {
      const entity = createMovable(-5, 99, -50, 77);
      Physics.clampHorizontal(entity, 0, 200);
      expect(entity.y).toBe(99);
      expect(entity.vy).toBe(77);
    });

    it("funciona com limites negativos", () => {
      const entity = createMovable(-200, 0, -10, 0);
      Physics.clampHorizontal(entity, -100, 100);
      expect(entity.x).toBe(-100);
      expect(entity.vx).toBe(0);
    });

    it("com minX = maxX, seta x para esse valor se fora do range", () => {
      const entity = createMovable(50, 0, 10, 0);
      Physics.clampHorizontal(entity, 10, 10);
      expect(entity.x).toBe(10);
      expect(entity.vx).toBe(0);
    });
  });
});