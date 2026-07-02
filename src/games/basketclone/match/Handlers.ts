// D:\Nakama\src\games\basketclone\match\Handlers.ts

import { MatchHandlerContext } from "../core/types/MatchTypes";
import { BasketCloneMatchState } from "./MatchState";
import { ServerOpCode } from "../core/messages/MatchMessages";
import { PlayerInputState } from "../gameplay/PlayerInput";

type Ctx = MatchHandlerContext<BasketCloneMatchState>;

/**
 * Formato esperado do payload JSON de uma mensagem PLAYER_INPUT.
 * Mantido como "tudo opcional + default false" para tolerar
 * clientes que só mandam os campos que mudaram.
 */
interface PlayerInputMessagePayload {
  moveLeft?: boolean;
  moveRight?: boolean;
  jumpHeld?: boolean;
  shootHeld?: boolean;
}

/**
 * Substitui a leitura direta do teclado do client. O cliente manda
 * o estado atual das teclas relevantes sempre que ele muda; aqui
 * só guardamos esse estado em `state.gameplay.input[role]` — quem
 * decide o que fazer com isso (mover, saltar, arremessar) é o
 * GameplayEngine, no próximo tick do matchLoop.
 */
export function handlePlayerInput(ctx: Ctx, message: nkruntime.MatchMessage): void {
  const role = ctx.state.gameplay.roleByUserId[message.sender.userId];

  if (!role) {
    ctx.logger.warn(
      "[basketclone:match] handlePlayerInput: %s ainda não tem papel atribuído na partida.",
      message.sender.userId
    );
    return;
  }

  let payload: PlayerInputMessagePayload;
  try {
    payload = JSON.parse(ctx.nk.binaryToString(message.data));
  } catch (error) {
    // Mensagem malformada de UM cliente não deve derrubar a partida
    // para os dois jogadores — log e descarta o pacote, sem repropagar.
    ctx.logger.error(
      "[basketclone:match] PLAYER_INPUT inválido recebido de %s: %s",
      message.sender.userId,
      error
    );
    return;
  }

  const current: PlayerInputState = ctx.state.gameplay.input[role];
  current.moveLeft = !!payload.moveLeft;
  current.moveRight = !!payload.moveRight;
  current.jumpHeld = !!payload.jumpHeld;
  current.shootHeld = !!payload.shootHeld;
}

export function handlePing(ctx: Ctx, message: nkruntime.MatchMessage): void {
  ctx.dispatcher.broadcastMessage(ServerOpCode.PONG, null, [message.sender]);
}

export function handleReady(ctx: Ctx, message: nkruntime.MatchMessage): void {
  const player = ctx.state.players[message.sender.userId];

  if (!player) {
    ctx.logger.warn(
      "[basketclone:match] handleReady: jogador %s não encontrado no estado da partida.",
      message.sender.userId
    );
    return;
  }

  player.ready = true;
  ctx.logger.info("[basketclone:match] Jogador %s sinalizou ready.", message.sender.userId);
}
