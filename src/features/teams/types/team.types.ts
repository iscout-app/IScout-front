export interface Team {
  id: string
  fullName: string
  shortName?: string
  iconUrl?: string
  mainColorHex?: string
  secondaryColorHex?: string
  createdBy: string
}

export interface CreateTeamDto {
  fullName: string
  shortName?: string
  iconUrl?: string
  mainColorHex?: string
  secondaryColorHex?: string
}

export interface UpdateTeamDto {
  fullName?: string
  shortName?: string
  iconUrl?: string
  mainColorHex?: string
  secondaryColorHex?: string
}
