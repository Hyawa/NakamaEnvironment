/**
 * Configuração estática do matchmaking do basketclone.
 *
 * IMPORTANTE — ponto de integração com o módulo `match`:
 * `matchModuleName` precisa ser EXATAMENTE igual ao identificador
 * passado em `initializer.registerMatch(moduleName, handler)` dentro
 * de `games/basketclone/match/index.ts`. Este módulo de matchmaking
 * não tem nenhuma outra forma de "ver" esse nome — se os dois
 * arquivos usarem strings diferentes, `nk.matchCreate` vai falhar
 * silenciosamente em tempo de execução (não em tempo de compilação).
 * Ajuste o valor abaixo para bater com o que já existe em `match/`.
 */
export const MATCHMAKING_CONFIG = {
  mode: "basketclone",
  maxPlayers: 2,
  minPlayers: 2,
  label: "basketclone_v1",
  matchModuleName: "basketclone_v1",
};