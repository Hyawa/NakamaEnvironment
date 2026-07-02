// D:\Nakama\src\games\basketclone\tests\gameplay\GameplayEngine.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { GameplayEngine } from '../../gameplay/GameplayEngine';
import { GameplayState } from '../../gameplay/GameplayState';

describe('GameplayEngine - Estabilidade', () => {
  let state: GameplayState;
  let mockLogger: any;

  beforeEach(() => {
    try {
      // Criação do estado inicial usando o método estático real da sua engine
      state = GameplayEngine.createInitialState();
      
      // Mock do nkruntime.Logger exigido pela engine
      mockLogger = {
        debug: () => {},
        info: () => {},
        warn: () => {},
        error: () => {}
      };
    } catch (error) {
      console.error('[GameplayEngine.test] Falha na inicialização do estado da Engine. Contexto: Setup beforeEach.', {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  });

  it('não deve lançar exceções durante múltiplas atualizações consecutivas (estabilidade)', () => {
    const ticksToSimulate = 100;
    
    expect(() => {
      for (let i = 0; i < ticksToSimulate; i++) {
        try {
          // Chamada corrigida para o método ESTÁTICO, passando estado, deltaSeconds e logger
          GameplayEngine.update(state, 0.016, mockLogger); 
        } catch (updateError) {
          console.error(`[GameplayEngine.test] Exceção lançada no tick ${i}.`, {
            error: updateError instanceof Error ? updateError.message : updateError,
            tick: i
          });
          throw updateError;
        }
      }
    }).not.toThrow();
  });

  it('deve gerar snapshots do estado sem erros', () => {
    // CORREÇÃO: Passando o mockLogger como segundo argumento conforme assinatura atualizada
    const snapshot = GameplayEngine.buildSnapshot(state, mockLogger);
    
    expect(snapshot).toBeDefined();
    expect(snapshot.player1).toBeDefined();
    expect(snapshot.player2).toBeDefined();
    expect(snapshot.ball).toBeDefined();
    expect(typeof snapshot.isPaused).toBe('boolean');
  });
});