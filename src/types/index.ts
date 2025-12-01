/**
 * Type Definitions for IScout Application
 *
 * Centralized TypeScript interfaces matching the backend API schema
 */

// ==================== User & Auth ====================

export type UserRole = 'admin' | 'tecnico' | 'olheiro' | 'responsavel';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthData {
  token?: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

// ==================== Team ====================

export interface Team {
  id: string;
  fullName: string;
  shortName: string;   // Max 4 chars
  iconUrl?: string;
  mainColorHex: string;      // 6 chars hex
  secondaryColorHex: string; // 6 chars hex
  createdBy: string;  // User ID
}

export interface CreateTeamRequest {
  fullName: string;
  shortName: string;
  iconUrl?: string;
  mainColorHex: string;
  secondaryColorHex: string;
}

// ==================== Player/Athlete ====================

export type PlayerPosition =
  | 'Goleiro'
  | 'Zagueiro'
  | 'Lateral-Direito'
  | 'Lateral-Esquerdo'
  | 'Volante'
  | 'Meia'
  | 'Meia-Atacante'
  | 'Ponta-Direita'
  | 'Ponta-Esquerda'
  | 'Centroavante';

export interface Player {
  id: string;
  name: string;
  birthdate: string;  // ISO date string
  teamId: string;
  shirtNumber: number;
  position: PlayerPosition;

  // Denormalized stats from athleteCareer
  matches: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

export interface CreatePlayerRequest {
  name: string;
  birthdate: string;
  teamId: string;
  position: PlayerPosition;
  shirtNumber: number;
}

export interface UpdatePlayerRequest {
  name?: string;
  birthdate?: string;
  position?: PlayerPosition;
  shirtNumber?: number;
  teamId?: string;
}

// ==================== Match ====================

export interface Match {
  id: string;
  timestamp: string;  // ISO date string
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
}

export interface CreateMatchRequest {
  timestamp: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
}

// ==================== Stats ====================

export interface MatchStat {
  id?: string;
  athleteId: string;
  matchId: string;
  teamId: string;
  position: PlayerPosition;
  goals: number;
  assists: number;
  yellowCards: number;  // 0-2
  redCards: number;     // 0-1
}

export interface CreateStatRequest {
  athleteId: string;
  matchId: string;
  teamId: string;
  position: PlayerPosition;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

export interface PlayerHistory {
  id: string;
  athleteId: string;
  matchId: string;
  teamId: string;
  position: PlayerPosition;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  matchDate: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
}

export interface PlayerEvolution {
  date: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  cumulativeGoals: number;
  cumulativeAssists: number;
  cumulativeYellowCards: number;
  cumulativeRedCards: number;
  matchId: string;
}

// ==================== Dashboard ====================

export interface DashboardSummary {
  totalPlayers: number;
  totalMatches: number;
  totalGoals: number;
  avgPerformance: number;
}

export interface TopPerformer {
  id: string;
  name: string;
  goals: number;
  assists: number;
  matches: number;
  position: PlayerPosition;
}

export interface RecentMatch {
  id: string;
  timestamp: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
}

export interface PositionDistribution {
  position: PlayerPosition;
  count: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  topPerformers: TopPerformer[];
  recentMatches: RecentMatch[];
  positionDistribution: PositionDistribution[];
}

// ==================== API Response ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ==================== Filters ====================

export interface PlayerFilters {
  teamId?: string;
  position?: PlayerPosition;
  name?: string;
}

export interface DashboardFilters {
  teamId?: string;
}

// ==================== Permissions ====================

export interface PermissionConfig {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canViewAll: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, PermissionConfig> = {
  admin: {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canViewAll: true,
  },
  tecnico: {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canViewAll: true,
  },
  olheiro: {
    canCreate: true,
    canEdit: true,
    canDelete: false,
    canViewAll: true,
  },
  responsavel: {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canViewAll: false,
  },
};
