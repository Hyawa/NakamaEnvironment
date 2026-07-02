/**
 * Constrói o label textual de uma partida de basketclone.
 *
 * Usado para identificar/filtrar partidas (ex.: em `nk.matchList`)
 * e repassado como parâmetro na criação da match, para que
 * `match/index.ts` possa opcionalmente usá-lo no retorno de
 * `matchInit` (campo `label`), sem que este módulo precise conhecer
 * a implementação interna do match handler.
 *
 * Função pura: sem acesso a estado, banco ou runtime do Nakama.
 */
export function buildMatchLabel(mode: string): string {
  return `${mode}_v1`;
}