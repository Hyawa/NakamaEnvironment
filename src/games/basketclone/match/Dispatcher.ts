// D:\Nakama\src\games\basketclone\match\Dispatcher.ts

import { ClientOpCode } from "../core/messages/MatchMessages";
import { MatchHandlerContext } from "../core/types/MatchTypes";
import { BasketCloneMatchState } from "./MatchState";
import { handlePlayerInput, handlePing, handleReady } from "./Handlers";

type Ctx = MatchHandlerContext<BasketCloneMatchState>;
export type MessageHandler = (ctx: Ctx, message: nkruntime.MatchMessage) => void;

/**
 * Roteia mensagens recebidas dos clientes (por opCode) para o
 * handler correto. Não contém nenhuma lógica de jogo — apenas
 * roteamento. A lógica em si vive em Handlers.ts.
 */
export class MatchMessageDispatcher {
  private readonly handlers: Partial<Record<ClientOpCode, MessageHandler>> = {};

  register(opCode: ClientOpCode, handler: MessageHandler): void {
    this.handlers[opCode] = handler;
  }

  dispatch(ctx: Ctx, message: nkruntime.MatchMessage): void {
    const handler = this.handlers[message.opCode as ClientOpCode];

    if (!handler) {
      ctx.logger.warn(
        "[basketclone:match] Mensagem com opCode desconhecido recebida: %d (sender=%s)",
        message.opCode,
        message.sender.userId
      );
      return;
    }

    handler(ctx, message);
  }
}

/**
 * Instância única do dispatcher, com os handlers já registrados.
 * Importada por Match.ts dentro de matchLoop.
 */
export const messageDispatcher = new MatchMessageDispatcher();
messageDispatcher.register(ClientOpCode.PLAYER_INPUT, handlePlayerInput);
messageDispatcher.register(ClientOpCode.PING, handlePing);
messageDispatcher.register(ClientOpCode.READY, handleReady);
