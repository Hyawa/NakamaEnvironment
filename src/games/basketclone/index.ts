// D:\Nakama\src\games\basketclone\index.ts

import { registerMatchmaking } from "./matchmaking";
import { registerRpc } from "./rpc";
import { registerMatch } from "./match";

export function registerBasketClone(
    initializer: nkruntime.Initializer
): void {
    registerMatchmaking(initializer);
    registerRpc(initializer);
    registerMatch(initializer);
}