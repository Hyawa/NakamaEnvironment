// D:\Nakama\src\games\basketclone\core\messages\MatchMessages.ts
/**
 * Opcodes trocados entre cliente e servidor dentro do match do basketclone.
 * Deve ser idêntico ao MatchMessages.ts do frontend.
 */
export enum ClientOpCode {
  PING = 1,
  READY = 2,
  PLAYER_INPUT = 3,
}

export enum ServerOpCode {
  PONG = 100,
  MATCH_STATE = 101,
  MATCH_FINISHED = 102,
  ERROR = 999,
}