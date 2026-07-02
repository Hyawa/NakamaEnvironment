// D:\Nakama\src\games\basketclone\matchmaking\Matchmaker.ts

import { onMatchmakerMatched } from "./onMatchmakerMatched";

/**
 * Registra o handler de matchmaker do Nakama para o basketclone.
 *
 * Responsabilidade única: ligar o evento `matchmakerMatched` do
 * runtime à função que sabe criar a partida (onMatchmakerMatched).
 * Nenhuma lógica de pareamento ou de criação de match deve viver
 * neste arquivo.
 */
export function registerMatchmakerMatched(initializer: nkruntime.Initializer): void {
  initializer.registerMatchmakerMatched(onMatchmakerMatched);
}