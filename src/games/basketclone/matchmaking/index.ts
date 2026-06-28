// D:\Nakama\src\games\basketclone\matchmaking\index.ts

import { registerMatchmakerMatched } from "./Matchmaker";

export function registerMatchmaking(
    initializer: nkruntime.Initializer
): void {
    registerMatchmakerMatched(initializer);
}