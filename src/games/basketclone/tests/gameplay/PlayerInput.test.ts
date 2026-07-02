import { describe, it, expect } from "vitest";
import { createNeutralInput, PlayerInputState } from "../../gameplay/PlayerInput";

describe("PlayerInput", () => {
  describe("createNeutralInput", () => {
    it("deve retornar objeto definido", () => {
      const input = createNeutralInput();
      expect(input).toBeDefined();
    });

    it("moveLeft deve ser false", () => {
      const input = createNeutralInput();
      expect(input.moveLeft).toBe(false);
    });

    it("moveRight deve ser false", () => {
      const input = createNeutralInput();
      expect(input.moveRight).toBe(false);
    });

    it("jumpHeld deve ser false", () => {
      const input = createNeutralInput();
      expect(input.jumpHeld).toBe(false);
    });

    it("shootHeld deve ser false", () => {
      const input = createNeutralInput();
      expect(input.shootHeld).toBe(false);
    });

    it("cria instâncias independentes a cada chamada", () => {
      const a = createNeutralInput();
      const b = createNeutralInput();
      a.moveLeft = true;
      expect(b.moveLeft).toBe(false);
    });

    it("possui exatamente os quatro campos esperados", () => {
      const input = createNeutralInput();
      const keys = Object.keys(input);
      expect(keys).toContain("moveLeft");
      expect(keys).toContain("moveRight");
      expect(keys).toContain("jumpHeld");
      expect(keys).toContain("shootHeld");
    });
  });

  describe("PlayerInputState — shape do tipo", () => {
    it("todos os campos são booleanos no estado neutro", () => {
      const input: PlayerInputState = createNeutralInput();
      expect(typeof input.moveLeft).toBe("boolean");
      expect(typeof input.moveRight).toBe("boolean");
      expect(typeof input.jumpHeld).toBe("boolean");
      expect(typeof input.shootHeld).toBe("boolean");
    });

    it("aceita todos os campos como true", () => {
      const input: PlayerInputState = {
        moveLeft: true,
        moveRight: true,
        jumpHeld: true,
        shootHeld: true,
      };
      expect(input.moveLeft).toBe(true);
      expect(input.moveRight).toBe(true);
      expect(input.jumpHeld).toBe(true);
      expect(input.shootHeld).toBe(true);
    });

    it("cópia com spread gera objeto independente", () => {
      const original = createNeutralInput();
      const copy = { ...original };
      copy.moveLeft = true;
      expect(original.moveLeft).toBe(false);
    });
  });
});