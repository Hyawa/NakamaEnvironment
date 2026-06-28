// src/games/basketclone/matchmaking/MatchmakerTypes.ts

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export interface MatchProperties {
    mode?: '1v1' | '5v5';
    type?: 'ranked' | 'normal';
    min_mmr?: number;
    max_mmr?: number;
}