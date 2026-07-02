// D:\Nakama\src\games\basketclone\matchmaking\onMatchmakerMatched.ts

import { MATCHMAKING_CONFIG } from "./config";
import { buildMatchLabel } from "./helpers/buildMatchLabel";

/**
 * Executado pelo runtime do Nakama quando o matchmaker encontra um
 * grupo de jogadores compatível com os critérios da fila do
 * basketclone (definidos na query usada em `matchmakerAdd`, que é
 * responsabilidade do RPC, não deste módulo).
 *
 * Responsabilidade única: extrair os userIds pareados e acionar a
 * criação da partida autoritativa correspondente, retornando o
 * matchId para o Nakama distribuir aos clientes.
 *
 * Este arquivo NÃO decide regras de jogo, NÃO calcula MMR e NÃO
 * conhece a implementação interna do módulo `match` — apenas aciona
 * sua criação via `nk.matchCreate`.
 */
export const onMatchmakerMatched: nkruntime.MatchmakerMatchedFunction = function (
  ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  matches: nkruntime.MatchmakerResult[]
): string | void {
  if (!matches || matches.length === 0) {
    logger.warn("[basketclone:matchmaking] onMatchmakerMatched chamado sem jogadores pareados.");
    return;
  }

  const userIds: string[] = matches.map((entry) => entry.presence.userId);

  logger.info(
    "[basketclone:matchmaking] %d jogador(es) pareado(s): %s",
    userIds.length,
    userIds.join(", ")
  );

  // Regra de negócio: hoje o basketclone só suporta exatamente
  // MATCHMAKING_CONFIG.maxPlayers jogadores por partida. Se o
  // matchmaker entregar uma quantidade diferente, é melhor falhar
  // alto agora (e investigar a causa raiz na config/query de
  // matchmaking) do que criar uma partida em estado inconsistente.
  if (userIds.length !== MATCHMAKING_CONFIG.maxPlayers) {
    throw new Error(
      `[basketclone:matchmaking] Pareamento com ${userIds.length} jogador(es), esperado ${MATCHMAKING_CONFIG.maxPlayers}.`
    );
  }

  try {
    const matchId: string = nk.matchCreate(MATCHMAKING_CONFIG.matchModuleName, {
      players: userIds,
      mode: MATCHMAKING_CONFIG.mode,
      label: buildMatchLabel(MATCHMAKING_CONFIG.mode),
    });

    logger.info("[basketclone:matchmaking] Match criada com sucesso. matchId=%s", matchId);

    return matchId;
  } catch (error) {
    // Regra do projeto: não engolir exceções. Loga o contexto
    // completo (quem ficou sem partida) e repropaga o erro para que
    // ele apareça nos logs do Nakama e o matchmaker trate a falha.
    logger.error(
      "[basketclone:matchmaking] Falha ao criar match para jogadores [%s]: %s",
      userIds.join(", "),
      error
    );
    throw error;
  }
};