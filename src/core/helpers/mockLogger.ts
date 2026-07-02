import { vi } from "vitest";

/**
 * Cria um mock do nkruntime.Logger compatível com todos os métodos
 * públicos exigidos pelo Nakama JS runtime.
 *
 * Usar vi.fn() permite assertar chamadas quando necessário:
 *   const logger = createMockLogger()
 *   expect(logger.error).toHaveBeenCalled()
 */
export function createMockLogger(): nkruntime.Logger {
  return {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    format: vi.fn(),
  } as unknown as nkruntime.Logger;
}