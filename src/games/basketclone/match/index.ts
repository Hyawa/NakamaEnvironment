import { registerBasketMatch } from "./Match";

export function registerMatch(
    initializer: nkruntime.Initializer
): void {
    registerBasketMatch(initializer);
}