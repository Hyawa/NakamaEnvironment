import { PlayerId } from "../../gameplay/entities/Player";

/**
 * Tipos auxiliares do módulo de match do basketclone.
 * Apenas formas de dados — nenhuma lógica deve viver aqui.
 */

/**
 * Informação mínima mantida sobre cada jogador conectado à partida.
 *
 * `role` é o papel de gameplay ("player1"/"player2") atribuído a
 * este userId — ver GameplayEngine.assignRole. Fica null enquanto
 * a partida já está cheia e, por algum motivo, esse caso não devia
 * ter passado por matchJoinAttempt (defensivo).
 */
export interface PlayerInfo {
  userId: string;
  sessionId: string;
  username: string;
  presence: nkruntime.Presence;
  ready: boolean;
  connected: boolean;
  role: PlayerId | null;
}

/**
 * Agrupa os parâmetros que o Nakama injeta em cada execução do
 * match handler (ctx, logger, nk, dispatcher, tick, state), para
 * que o Dispatcher e os Handlers não precisem repassar 5-6
 * argumentos soltos entre si.
 *
 * `dispatcher` aqui é o `nkruntime.MatchDispatcher` nativo (usado
 * para broadcast/kick/label update) — não confundir com o
 * `MatchMessageDispatcher` definido em Dispatcher.ts, que é o
 * roteador interno de mensagens por opCode.
 */
export interface MatchHandlerContext<State extends nkruntime.MatchState = nkruntime.MatchState> {
  ctx: nkruntime.Context;
  logger: nkruntime.Logger;
  nk: nkruntime.Nakama;
  dispatcher: nkruntime.MatchDispatcher;
  tick: number;
  state: State;
}