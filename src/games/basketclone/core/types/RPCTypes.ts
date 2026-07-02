// D:\Nakama\src\games\basketclone\rpc\Types.ts

export interface HealthcheckResponse {
    status: string;
    message: string;
    timestamp: number;
}

export interface GetVersionResponse {
    version: string;
}

export interface PingRequest {
    clientTime: number;
}

export interface PingResponse {
    clientTime: number;
    serverTime: number;
    latencyEstimation?: number;
}

export interface CreateMatchRequest {
    gameMode: string; // Ex: '1v1', '5v5'
}

export interface CreateMatchResponse {
    success: boolean;
    matchId?: string;
    error?: string;
}

export interface LeaveQueueRequest {
    ticket: string; // Ticket do Nakama Matchmaker
}

export interface LeaveQueueResponse {
    success: boolean;
}