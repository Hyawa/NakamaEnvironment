/**
 * Substitui o papel do `Keyboard.ts` do client: lá, o jogo lia
 * `keyboard.isPressed(...)` direto do DOM; aqui, o estado de input
 * de cada jogador chega por mensagem de rede (PLAYER_INPUT) e é
 * guardado nesta estrutura simples para o GameplayEngine consultar
 * a cada tick.
 */
export interface PlayerInputState {
  moveLeft: boolean;
  moveRight: boolean;
  jumpHeld: boolean;
  shootHeld: boolean;
}

export function createNeutralInput(): PlayerInputState {
  return {
    moveLeft: false,
    moveRight: false,
    jumpHeld: false,
    shootHeld: false,
  };
}
