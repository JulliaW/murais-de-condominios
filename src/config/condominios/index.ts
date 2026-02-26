import type { CondominioConfig } from './village-novus'
import villageNovus from './village-novus'

// Registro de todos os condomínios disponíveis
const condominios: Record<string, CondominioConfig> = {
    'village-novus': villageNovus,
}

/**
 * Obtém a configuração de um condomínio pelo slug
 */
export function getCondominioConfig(slug: string): CondominioConfig | null {
    return condominios[slug.toLowerCase()] || null
}

/**
 * Verifica se um condomínio existe
 */
export function condominioExiste(slug: string): boolean {
    return slug.toLowerCase() in condominios
}

/**
 * Lista todos os slugs de condomínios disponíveis
 */
export function listarCondominios(): string[] {
    return Object.keys(condominios)
}

/**
 * Obtém todas as configurações
 */
export function getTodosCondominios(): CondominioConfig[] {
    return Object.values(condominios)
}

export type { CondominioConfig }
export { villageNovus }
