export interface Stat {
  id: string
  playerId: string
  playerName?: string
  eventDate: string
  eventType: EventType
  opponent?: string
  location?: string
  technical: TechnicalStats
  tactical: TacticalStats
  physical: PhysicalStats
  psychological: PsychologicalStats
  overall: number
  observations?: string
  createdAt: string
  updatedAt: string
}

export type EventType = 'Partida' | 'Treino' | 'Avaliação'

export const EVENT_TYPES: EventType[] = ['Partida', 'Treino', 'Avaliação']

export interface TechnicalStats {
  dribbling: number // 0-10
  passing: number // 0-10
  shooting: number // 0-10
  control: number // 0-10
}

export interface TacticalStats {
  positioning: number // 0-10
  vision: number // 0-10
  decisionMaking: number // 0-10
}

export interface PhysicalStats {
  speed: number // 0-10
  stamina: number // 0-10
  strength: number // 0-10
}

export interface PsychologicalStats {
  concentration: number // 0-10
  motivation: number // 0-10
  teamwork: number // 0-10
}

export interface CreateStatDto {
  playerId: string
  eventDate: string
  eventType: EventType
  opponent?: string
  location?: string
  technical: TechnicalStats
  tactical: TacticalStats
  physical: PhysicalStats
  psychological: PsychologicalStats
  observations?: string
}

export interface UpdateStatDto extends Partial<CreateStatDto> {}

export interface StatFilters {
  playerId?: string
  eventType?: EventType
  startDate?: string
  endDate?: string
}

export const STAT_CATEGORIES = {
  technical: ['dribbling', 'passing', 'shooting', 'control'],
  tactical: ['positioning', 'vision', 'decisionMaking'],
  physical: ['speed', 'stamina', 'strength'],
  psychological: ['concentration', 'motivation', 'teamwork'],
} as const

export const STAT_LABELS = {
  // Technical
  dribbling: 'Drible',
  passing: 'Passe',
  shooting: 'Finalização',
  control: 'Controle',
  // Tactical
  positioning: 'Posicionamento',
  vision: 'Visão de Jogo',
  decisionMaking: 'Tomada de Decisão',
  // Physical
  speed: 'Velocidade',
  stamina: 'Resistência',
  strength: 'Força',
  // Psychological
  concentration: 'Concentração',
  motivation: 'Motivação',
  teamwork: 'Trabalho em Equipe',
}
