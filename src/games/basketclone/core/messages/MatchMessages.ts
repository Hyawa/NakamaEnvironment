/**
 * Opcodes trocados entre cliente e servidor dentro do match do
 * basketclone. Centralizados aqui para que nenhum número mágico de
 * opcode apareça espalhado pelo restante do módulo.
 */

export enum ClientOpCode {
  PING = 1,
  READY = 2,
  PLAYER_INPUT = 3,
}

export enum ServerOpCode {
  PONG = 100,
  MATCH_STATE = 101,
  ERROR = 999,
}
