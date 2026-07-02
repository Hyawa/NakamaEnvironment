// D:\Nakama\src\games\basketclone\match\Match.ts

import { MATCH_CONSTANTS, MatchPhase } from "../core/constants/MatchConstants";
import { BasketCloneMatchState } from "./MatchState";
import { PlayerInfo } from "../core/types/MatchTypes";
import { messageDispatcher } from "./Dispatcher";
import { ServerOpCode } from "../core/messages/MatchMessages";
import { GameplayEngine } from "../gameplay/GameplayEngine";

/**
 * Match Handler autoritativo do basketclone.
 *
 * Agora com a lógica de gameplay (movimento, física, colisão,
 * posse, arremesso, placar, reinício após cesta) adaptada de
 * src/core/Game.ts e dependências do client — ver gameplay/.
 *
 * O que ainda NÃO está aqui: cronômetro de partida, condição de
 * vitória/derrota, e qualquer tratamento de reconexão além de
 * marcar o jogador como desconectado (ver TODO em matchLeave).
 */

export const matchInit: nkruntime.MatchInitFunction<BasketCloneMatchState> = function (
  ctx,
  logger,
  nk,
  params
) {
  const state: BasketCloneMatchState = {
    phase: MatchPhase.WAITING_FOR_PLAYERS,
    tick: 0,
    matchTimeMs: 0,
    players: {},
    gameplay: GameplayEngine.createInitialState(),
  };

  logger.info("[basketclone:match] Partida criada. params=%s", JSON.stringify(params));

  return {
    state,
    tickRate: MATCH_CONSTANTS.TICK_RATE,
    label: MATCH_CONSTANTS.LABEL,
  };
};

export const matchJoinAttempt: nkruntime.MatchJoinAttemptFunction<BasketCloneMatchState> = function (
  ctx,
  logger,
  nk,
  dispatcher,
  tick,
  state,
  presence,
  metadata
) {
  const isRejoining = !!state.players[presence.userId];
  const connectedCount = Object.values(state.players).filter((p) => p.connected).length;

  if (!isRejoining && connectedCount >= MATCH_CONSTANTS.MAX_PLAYERS) {
    logger.warn(
      "[basketclone:match] Recusando entrada de %s: partida cheia (%d/%d).",
      presence.userId,
      connectedCount,
      MATCH_CONSTANTS.MAX_PLAYERS
    );
    return { state, accept: false, rejectMessage: "Partida cheia." };
  }

  return { state, accept: true };
};

export const matchJoin: nkruntime.MatchJoinFunction<BasketCloneMatchState> = function (
  ctx,
  logger,
  nk,
  dispatcher,
  tick,
  state,
  presences
) {
  presences.forEach((presence) => {
    const role = GameplayEngine.assignRole(state.gameplay, presence.userId);

    const player: PlayerInfo = {
      userId: presence.userId,
      sessionId: presence.sessionId,
      username: presence.username,
      presence,
      ready: false,
      connected: true,
      role,
    };

    state.players[presence.userId] = player;
    logger.info("[basketclone:match] Jogador entrou: %s (papel=%s)", presence.userId, role ?? "nenhum");
  });

  const assignedRoles = Object.values(state.gameplay.roleByUserId);
  const bothRolesAssigned = assignedRoles.length >= MATCH_CONSTANTS.MIN_PLAYERS;

  if (bothRolesAssigned && state.phase === MatchPhase.WAITING_FOR_PLAYERS) {
    state.phase = MatchPhase.IN_PROGRESS;
    logger.info("[basketclone:match] Os dois jogadores entraram. Partida iniciada.");
  }

  return { state };
};

export const matchLeave: nkruntime.MatchLeaveFunction<BasketCloneMatchState> = function (
  ctx,
  logger,
  nk,
  dispatcher,
  tick,
  state,
  presences
) {
  presences.forEach((presence) => {
    const player = state.players[presence.userId];

    if (player) {
      player.connected = false;
    }

    logger.info("[basketclone:match] Jogador saiu: %s", presence.userId);
  });

  // TODO(produto): hoje a simulação continua rodando com o input do
  // jogador desconectado simplesmente parado de chegar (o personagem
  // fica parado no ar/chão conforme a física). Pausar a partida,
  // dar um tempo de reconexão ou decretar walkover são decisões de
  // produto a definir — não implementadas nesta etapa.

  return { state };
};

export const matchLoop: nkruntime.MatchLoopFunction<BasketCloneMatchState> = function (
  ctx,
  logger,
  nk,
  dispatcher,
  tick,
  state,
  messages
) {
  logger.info("[basketclone:matchLoop] INÍCIO DO TICK %d. Phase: %s", tick, state.phase);

  state.tick = tick;
  state.matchTimeMs += Math.round(1000 / MATCH_CONSTANTS.TICK_RATE);

  const handlerCtx = { ctx, logger, nk, dispatcher, tick, state };

  logger.info("[basketclone:matchLoop] Processando %d mensagens...", messages.length);
  messages.forEach((message) => {
    try {
      messageDispatcher.dispatch(handlerCtx, message);
    } catch (error) {
      // Regra do projeto: não engolir exceções. Loga o contexto da
      // falha e repropaga — diferente de um payload malformado (que
      // os Handlers já tratam e descartam), isto aqui é uma falha
      // inesperada no roteamento/handler em si.
      logger.error(
        "[basketclone:match] Erro ao processar mensagem opCode=%d de %s: %s",
        message.opCode,
        message.sender.userId,
        error instanceof Error ? error.stack ?? error.message : String(error)
      );
      throw error;
    }
  });
  logger.info("[basketclone:matchLoop] Processamento de mensagens concluído.");

  if (state.phase === MatchPhase.IN_PROGRESS) {
    const deltaSeconds = 1 / MATCH_CONSTANTS.TICK_RATE;
    
    logger.info("[basketclone:matchLoop] Iniciando GameplayEngine.update...");
    GameplayEngine.update(state.gameplay, deltaSeconds, logger);
    logger.info("[basketclone:matchLoop] Fim de GameplayEngine.update.");

    logger.info("[basketclone:matchLoop] Iniciando GameplayEngine.buildSnapshot...");
    const snapshot = GameplayEngine.buildSnapshot(state.gameplay, logger);
    logger.info("[basketclone:matchLoop] Fim de GameplayEngine.buildSnapshot.");

    logger.info("[basketclone:matchLoop] Antes de dispatcher.broadcastMessage...");
    dispatcher.broadcastMessage(ServerOpCode.MATCH_STATE, JSON.stringify(snapshot));
    logger.info("[basketclone:matchLoop] Depois de dispatcher.broadcastMessage.");
  }

  logger.info("[basketclone:matchLoop] FIM DO TICK %d.", tick);
  return { state };
};

export const matchSignal: nkruntime.MatchSignalFunction<BasketCloneMatchState> = function (
  ctx,
  logger,
  nk,
  dispatcher,
  tick,
  state,
  data
) {
  logger.info("[basketclone:match] Sinal recebido (tick=%d): %s", tick, data);
  return { state };
};

export const matchTerminate: nkruntime.MatchTerminateFunction<BasketCloneMatchState> = function (
  ctx,
  logger,
  nk,
  dispatcher,
  tick,
  state,
  graceSeconds
) {
  state.phase = MatchPhase.FINISHED;
  logger.info("[basketclone:match] Partida encerrando. graceSeconds=%d", graceSeconds);
  return { state };
};