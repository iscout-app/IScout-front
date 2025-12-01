export interface Player {
  id: string
  name: string
  birthDate: string
  position: PlayerPosition
  category: string
  height: number
  weight: number
  emailResponsavel: string
  emailTecnico?: string
  createdAt: string
  updatedAt: string
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

export interface CreatePlayerDto {
  name: string
  birthDate: string
  position: PlayerPosition
  category: string
  height: number
  weight: number
  emailResponsavel: string
  emailTecnico?: string
}

export interface UpdatePlayerDto extends Partial<CreatePlayerDto> {}

export interface PlayerFilters {
  search?: string
  position?: PlayerPosition
  category?: string
  emailResponsavel?: string
}
