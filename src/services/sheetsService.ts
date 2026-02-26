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
    conteudo: string
    data: string
    categoria: string
    fixado: boolean
    autor: string
}

export interface Evento {
    id: string
    titulo: string
    descricao: string
    dataInicio: string
    horario: string
    local: string
    categoria: string
}

export interface FAQItem {
    id: string
    pergunta: string
    resposta: string
    categoria: string
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

    return dados.map((item, index) => ({
        id: item.id || String(index + 1),
        titulo: item.titulo || item.Título || 'Sem título',
        conteudo: item.conteudo || item.Conteúdo || item.conteudo || '',
        data: item.data || item.Data || new Date().toISOString(),
        categoria: item.categoria || item.Categoria || 'Geral',
        fixado: item.fixado?.toLowerCase() === 'sim' || item.Fixado?.toLowerCase() === 'sim' || false,
        autor: item.autor || item.Autor || 'Administração',
    }))
}

/**
 * Busca eventos do condomínio
 */
export async function fetchEventos(url: string): Promise<Evento[]> {
    const dados = await fetchSheetData<Record<string, string>>(url)

    return dados.map((item, index) => ({
        id: item.id || String(index + 1),
        titulo: item.titulo || item.Título || 'Sem título',
        descricao: item.descricao || item.Descrição || item.descricao || '',
        dataInicio: item.data || item.Data || item.dataInicio || item['Data Início'] || '',
        horario: item.horario || item.Horário || item.Horario || '',
        local: item.local || item.Local || 'A definir',
        categoria: item.categoria || item.Categoria || 'Geral',
    }))
}

/**
 * Busca FAQ do condomínio
 */
export async function fetchFAQ(url: string): Promise<FAQItem[]> {
    const dados = await fetchSheetData<Record<string, string>>(url)

    return dados.map((item, index) => ({
        id: item.id || String(index + 1),
        pergunta: item.pergunta || item.Pergunta || 'Sem pergunta',
        resposta: item.resposta || item.Resposta || 'Sem resposta',
        categoria: item.categoria || item.Categoria || 'Geral',
    }))
}

export { sheetsClient }
