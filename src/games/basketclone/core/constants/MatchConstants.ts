// D:\Nakama\src\games\basketclone\match\Constants.ts

/**
 * Constantes do módulo de match do basketclone.
 *
 * Nenhum número mágico relacionado ao ciclo de vida da partida
 * deve aparecer fora deste arquivo.
 *
 * IMPORTANTE — integração com o matchmaking:
 * `MODULE_NAME` precisa ser EXATAMENTE igual ao `matchModuleName`
 * configurado em `games/basketclone/matchmaking/config.ts`. É essa
 * string que `nk.matchCreate(...)` usa para localizar este handler
 * registrado via `initializer.registerMatch(...)`.
 */
export const MATCH_CONSTANTS = {
  MODULE_NAME: "basketclone_v1",
  TICK_RATE: 10,
  MAX_PLAYERS: 2,
  MIN_PLAYERS: 2,
  LABEL: "basketclone_v1",
};

/**
 * Fases do ciclo de vida da partida.
 *
 * Ainda não inclui granularidade de gameplay (ex.: "em posse de
 * bola", "em arremesso") — isso entra quando a lógica do jogo for
 * adaptada a partir do client.
 */
export enum MatchPhase {
  WAITING_FOR_PLAYERS = "WAITING_FOR_PLAYERS",
  IN_PROGRESS = "IN_PROGRESS",
  FINISHED = "FINISHED",
}