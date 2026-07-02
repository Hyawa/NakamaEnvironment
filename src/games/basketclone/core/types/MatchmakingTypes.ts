/**
 * Tipos de domínio do módulo de matchmaking do basketclone.
 *
 * Este arquivo não deve conter lógica — apenas formas de dados
 * usadas pelos outros arquivos deste módulo.
 */

/**
 * Representa a intenção de um jogador de entrar na fila.
 * Hoje é usado apenas como referência de domínio (documentação viva);
 * a validação real do ticket de entrada na fila é responsabilidade
 * do RPC que chama `matchmakerAdd` (ver games/basketclone/rpc).
 */
export type MatchmakingTicket = {
  userId: string;
  mode: "basketclone";
  rating?: number;
};

/**
 * Estado resultante depois que o matchmaker pareou os jogadores
 * e a partida autoritativa foi criada com sucesso.
 */
export type MatchmakerState = {
  matchId: string;
  players: string[];
};