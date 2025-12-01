export interface Player {
  id: string
  name: string
  birthdate: string
  position: string
  shirtNumber: number
  stats: PlayerStats
  teamId?: string
}

export interface PlayerStats {
  matches: number
  goals: number
  assists: number
  yellowCards: number
  redCards: number
}

export type PlayerPosition =
  | 'Goleiro'
  | 'Zagueiro'
  | 'Lateral Direito'
  | 'Lateral Esquerdo'
  | 'Volante'
  | 'Meio-Campo'
  | 'Atacante'
  | 'Ponta'

export const PLAYER_POSITIONS: PlayerPosition[] = [
  'Goleiro',
  'Zagueiro',
  'Lateral Direito',
  'Lateral Esquerdo',
  'Volante',
  'Meio-Campo',
  'Atacante',
  'Ponta',
]

export interface PlayersFilters {
  search: string
  categoria: string
  posicao: string
}
