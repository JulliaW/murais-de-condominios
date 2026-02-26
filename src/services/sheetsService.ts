import axios from 'axios'

// Cliente Axios específico para o opensheet
const sheetsClient = axios.create({
    baseURL: '',
    timeout: 10000,
    headers: {
        Accept: 'application/json',
    },
})

// Interceptors para tratamento global
sheetsClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Erro ao buscar dados da planilha:', error)
        return Promise.reject(error)
    }
)

export interface Aviso {
    id: string
    titulo: string
    descricao: string
    dataPublicacao: string
    dataExpiracao: string
    prioridade: string
    ativo: boolean
}

export interface Evento {
    id: string
    titulo: string
    descricao: string
    data: string
    horario: string
    local: string
    ativo: boolean
}

export interface FAQItem {
    id: string
    pergunta: string
    resposta: string
    ordem: number
    ativo: boolean
}

/**
 * Busca dados de uma planilha Google usando o opensheet.elk.sh
 * @param url URL completa da planilha no formato opensheet
 * @returns Array com os dados da planilha
 */
export async function fetchSheetData<T>(url: string): Promise<T[]> {
    try {
        const response = await sheetsClient.get<T[]>(url)
        return response.data || []
    } catch (error) {
        console.error(`Erro ao buscar dados de ${url}:`, error)
        throw new Error('Falha ao carregar dados da planilha')
    }
}

/**
 * Busca avisos do condomínio
 */
export async function fetchAvisos(url: string): Promise<Aviso[]> {
    const dados = await fetchSheetData<Record<string, string>>(url)

    return dados
        .filter((item) => item.ativo === 'TRUE' || item.Ativo === 'TRUE')
        .map((item, index) => ({
            id: item.id || String(index + 1),
            titulo: item.titulo || item.Titulo || 'Sem título',
            descricao: item.descricao || item.Descricao || '',
            dataPublicacao: item.data_publicacao || item['Data Publicacao'] || item['Data Publicação'] || '',
            dataExpiracao: item.data_expiracao || item['Data Expiracao'] || item['Data Expiração'] || '',
            prioridade: item.prioridade || item.Prioridade || '',
            ativo: item.ativo === 'TRUE' || item.Ativo === 'TRUE',
        }))
}

/**
 * Busca eventos do condomínio
 */
export async function fetchEventos(url: string): Promise<Evento[]> {
    const dados = await fetchSheetData<Record<string, string>>(url)

    return dados
        .filter((item) => item.ativo === 'TRUE' || item.Ativo === 'TRUE')
        .map((item, index) => ({
            id: item.id || String(index + 1),
            titulo: item.titulo || item.Titulo || 'Sem título',
            descricao: item.descricao || item.Descricao || '',
            data: item.data || item.Data || '',
            horario: item.horario || item.Horario || item.Horário || '',
            local: item.local || item.Local || '',
            ativo: item.ativo === 'TRUE' || item.Ativo === 'TRUE',
        }))
}

/**
 * Busca FAQ do condomínio
 */
export async function fetchFAQ(url: string): Promise<FAQItem[]> {
    const dados = await fetchSheetData<Record<string, string>>(url)

    return dados
        .filter((item) => item.ativo === 'TRUE' || item.Ativo === 'TRUE')
        .map((item, index) => ({
            id: item.id || String(index + 1),
            pergunta: item.pergunta || item.Pergunta || 'Sem pergunta',
            resposta: item.resposta || item.Resposta || 'Sem resposta',
            ordem: parseInt(item.ordem || item.Ordem || String(index)),
            ativo: item.ativo === 'TRUE' || item.Ativo === 'TRUE',
        }))
        .sort((a, b) => a.ordem - b.ordem)
}

export { sheetsClient }
