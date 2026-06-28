import { registerCreateMatchRpc } from "./CreateMatchRpc";
import { registerLeaveQueueRpc } from "./LeaveQueueRpc";

export function registerRpc(
    initializer: nkruntime.Initializer
): void {
    registerCreateMatchRpc(initializer);
    registerLeaveQueueRpc(initializer);
}