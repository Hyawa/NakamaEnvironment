// D:\Nakama\src\games\basketclone\match\Match.ts
import { MATCH_CONSTANTS, MatchPhase } from "../core/constants/MatchConstants";
import { BasketCloneMatchState } from "./MatchState";
import { PlayerInfo } from "../core/types/MatchTypes";
import { messageDispatcher } from "./Dispatcher";
import { ServerOpCode } from "../core/messages/MatchMessages";
import { GameplayEngine } from "../gameplay/GameplayEngine";
import { PlayerId } from "../gameplay/entities/Player";

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
    state.gameplay.phase = MatchPhase.IN_PROGRESS;
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
  state.tick = tick;

  // Atualiza tempo apenas se a partida está em andamento
  if (state.phase === MatchPhase.IN_PROGRESS) {
    state.matchTimeMs += Math.round(1000 / MATCH_CONSTANTS.TICK_RATE);
    state.gameplay.matchTimeMs = state.matchTimeMs;
  }

  const handlerCtx = { ctx, logger, nk, dispatcher, tick, state };

  messages.forEach((message) => {
    try {
      messageDispatcher.dispatch(handlerCtx, message);
    } catch (error) {
      logger.error(
        "[basketclone:match] Erro ao processar mensagem opCode=%d de %s: %s",
        message.opCode,
        message.sender.userId,
        error instanceof Error ? error.stack ?? error.message : String(error)
      );
      throw error;
    }
  });

  if (state.phase === MatchPhase.IN_PROGRESS) {
    const deltaSeconds = 1 / MATCH_CONSTANTS.TICK_RATE;
    GameplayEngine.update(state.gameplay, deltaSeconds, logger);

    // Verifica condição de vitória por tempo
    if (state.matchTimeMs >= MATCH_CONSTANTS.MATCH_DURATION_MS) {
      finishMatch(state, logger, dispatcher);
    }

    // Verifica condição de vitória por score (só se ainda não finalizou)
    if (state.phase === MatchPhase.IN_PROGRESS) {
      const winner = checkScoreVictory(state.gameplay.score);
      if (winner !== null) {
        state.gameplay.winner = winner;
        finishMatch(state, logger, dispatcher);
      }
    }

    // Só envia snapshot se a partida ainda está em andamento
    if (state.phase === MatchPhase.IN_PROGRESS) {
      const snapshot = GameplayEngine.buildSnapshot(state.gameplay, logger);
      dispatcher.broadcastMessage(ServerOpCode.MATCH_STATE, JSON.stringify(snapshot));
    }
  }

  return { state };
};

function checkScoreVictory(score: { player1: number; player2: number }): PlayerId | null {
  if (score.player1 >= MATCH_CONSTANTS.WINNING_SCORE) {
    return "player1";
  }
  if (score.player2 >= MATCH_CONSTANTS.WINNING_SCORE) {
    return "player2";
  }
  return null;
}

function finishMatch(
  state: BasketCloneMatchState,
  logger: nkruntime.Logger,
  dispatcher: nkruntime.MatchDispatcher
): void {
  state.phase = MatchPhase.FINISHED;
  state.gameplay.phase = MatchPhase.FINISHED;

  // Determina vencedor por score se ainda não foi definido
  if (state.gameplay.winner === null) {
    if (state.gameplay.score.player1 > state.gameplay.score.player2) {
      state.gameplay.winner = "player1";
    } else if (state.gameplay.score.player2 > state.gameplay.score.player1) {
      state.gameplay.winner = "player2";
    }
    // Se empatou, winner permanece null
  }

  logger.info(
    "[basketclone:match] Partida finalizada. Vencedor: %s. Score: %d x %d. Tempo: %dms",
    state.gameplay.winner ?? "empate",
    state.gameplay.score.player1,
    state.gameplay.score.player2,
    state.matchTimeMs
  );

  // Broadcast mensagem de fim de partida para todos os clientes
  const finishedPayload = {
    winner: state.gameplay.winner,
    score: state.gameplay.score,
    matchTimeMs: state.matchTimeMs,
  };

  dispatcher.broadcastMessage(ServerOpCode.MATCH_FINISHED, JSON.stringify(finishedPayload));
  logger.info("[basketclone:match] Broadcast MATCH_FINISHED enviado.");
}

export const matchSignal: nkruntime.MatchSignalFunction<BasketCloneMatchState> = function (
  ctx,
  logger,
  nk,
  dispatcher,
  tick,
  state,
  data
) {
  logger.debug("[basketclone:match] Sinal recebido (tick=%d): %s", tick, data);
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
  state.gameplay.phase = MatchPhase.FINISHED;
  logger.info("[basketclone:match] Partida encerrando. graceSeconds=%d", graceSeconds);
  return { state };
};