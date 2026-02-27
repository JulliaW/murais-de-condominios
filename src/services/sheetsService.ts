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

export interface Profissional {
    id: string
    data: string
    tipoServico: string
    nome: string
    telefone: string
    instagram: string
    comentarios: string
    nota: string
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

/**
 * Busca profissionais indicados via Google Apps Script
 * O Apps Script retorna array de arrays: [[cabecalho], [dados], [dados]...]
 */
export async function fetchProfissionais(url: string): Promise<Profissional[]> {
    try {
        const response = await sheetsClient.get<any[][]>(url)
        const dados = response.data

        console.log('Dados do Apps Script:', dados.slice(0, 5))

        // Se não houver dados suficientes, retorna vazio
        if (!dados || dados.length < 3) {
            console.log('Poucos dados na planilha')
            return []
        }

        // Pula as primeiras linhas vazias e encontra o cabeçalho
        let headerRowIndex = 0
        for (let i = 0; i < Math.min(dados.length, 5); i++) {
            const row = dados[i]
            if (row && row[0] && String(row[0]).includes('Carimbo')) {
                headerRowIndex = i
                break
            }
        }

        // Pega os cabeçalhos
        const headers = dados[headerRowIndex]

        // Mapeia os índices das colunas importantes
        const colData = headers.findIndex((h: any) => h && String(h).includes('Carimbo'))
        const colTipo = headers.findIndex((h: any) => h && String(h).includes('Tipo'))
        const colNome = headers.findIndex((h: any) => h && String(h).includes('Nome'))
        const colTelefone = headers.findIndex((h: any) => h && String(h).includes('Telefone'))
        const colInstagram = headers.findIndex((h: any) => h && String(h).includes('Instagram'))
        const colComentarios = headers.findIndex((h: any) => h && String(h).includes('Comentários'))
        const colNota = headers.findIndex((h: any) => h && String(h).includes('Notas'))

        console.log('Índices das colunas:', { colData, colTipo, colNome, colTelefone, colInstagram, colComentarios, colNota })

        // Processa os dados a partir da linha após os cabeçalhos
        const profissionais: Profissional[] = []
        for (let i = headerRowIndex + 1; i < dados.length; i++) {
            const row = dados[i]

            // Pula linhas vazias ou sem dados suficientes
            if (!row || row.length < 3) continue

            // Pega os valores pelos índices encontrados
            const getValue = (index: number) => index >= 0 && index < row.length ? String(row[index] || '') : ''

            // Verifica se é uma linha de dados válida (começa com data)
            const dataValue = getValue(colData)
            if (dataValue && dataValue.match(/^\d{2}\/\d{2}\/\d{4}/)) {
                profissionais.push({
                    id: String(profissionais.length + 1),
                    data: dataValue,
                    tipoServico: getValue(colTipo),
                    nome: getValue(colNome) || 'Sem nome',
                    telefone: getValue(colTelefone),
                    instagram: getValue(colInstagram),
                    comentarios: getValue(colComentarios),
                    nota: getValue(colNota),
                })
            }
        }

        console.log('Profissionais processados:', profissionais.slice(0, 3))
        return profissionais
    } catch (error) {
        console.error('Erro ao buscar profissionais:', error)
        throw new Error('Falha ao carregar dados dos profissionais')
    }
}

export { sheetsClient }
