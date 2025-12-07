/**
 * Calcula a idade de uma pessoa a partir da data de nascimento
 * @param birthdate Data de nascimento no formato ISO (YYYY-MM-DD) ou Date
 * @returns Idade em anos
 */
export function calculateAge(birthdate: string | Date): number {
  const birth = new Date(birthdate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  // Ajusta se ainda não fez aniversário este ano
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}

/**
 * Determina a categoria de base de futebol baseada na idade
 * @param birthdate Data de nascimento no formato ISO (YYYY-MM-DD) ou Date
 * @returns Categoria no formato "sub-XX" ou "profissional"
 */
export function getAgeCategory(birthdate: string | Date): string {
  const age = calculateAge(birthdate)

  // Categorias de base do futebol brasileiro
  if (age <= 11) return 'sub-11'
  if (age <= 13) return 'sub-13'
  if (age <= 15) return 'sub-15'
  if (age <= 17) return 'sub-17'
  if (age <= 20) return 'sub-20'
  if (age <= 23) return 'sub-23'

  return 'profissional'
}

/**
 * Formata a categoria para exibição
 * @param category Categoria no formato "sub-XX"
 * @returns Categoria formatada (ex: "Sub-17")
 */
export function formatCategory(category: string): string {
  if (category === 'profissional') return 'Profissional'
  return category.replace('sub-', 'Sub-')
}
