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
 * Busca profissionais indicados via Google Visualization API
 * O endpoint retorna JSONP que precisa ser parseado
 */
export async function fetchProfissionais(url: string): Promise<Profissional[]> {
    try {
        const response = await sheetsClient.get<string>(url)
        const jsonpData = response.data

        console.log('Resposta raw:', jsonpData.substring(0, 200))

        // Extrai o JSON do JSONP
        // Formato: /*O_o*/google.visualization.Query.setResponse({...})
        const match = jsonpData.match(/google\.visualization\.Query\.setResponse\((.*)\);?$/s)
        if (!match) {
            console.error('Não conseguiu parsear JSONP')
            return []
        }

        const jsonData = JSON.parse(match[1])
        console.log('Dados parseados:', jsonData)

        const { cols, rows } = jsonData.table

        console.log('Colunas:', cols.map((c: any) => c.label))
        console.log('Primeira linha:', rows[0])

        // Mapeia os índices das colunas
        const colData = cols.findIndex((c: any) => c.label?.includes('Carimbo'))
        const colTipo = cols.findIndex((c: any) => c.label?.includes('Tipo'))
        const colNome = cols.findIndex((c: any) => c.label?.includes('Nome'))
        const colTelefone = cols.findIndex((c: any) => c.label?.includes('Telefone'))
        const colInstagram = cols.findIndex((c: any) => c.label?.includes('Instagram'))
        const colComentarios = cols.findIndex((c: any) => c.label?.includes('Comentários'))
        const colNota = cols.findIndex((c: any) => c.label?.includes('Notas'))

        console.log('Índices:', { colData, colTipo, colNome, colTelefone, colInstagram, colComentarios, colNota })

        // Processa as linhas
        const profissionais: Profissional[] = []
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i].c

            // Pega o valor de uma célula (pode ser v.f ou v)
            const getValue = (index: number) => {
                if (index < 0 || index >= row.length) return ''
                const cell = row[index]
                if (!cell) return ''
                return cell.f || String(cell.v || '')
            }

            const dataValue = getValue(colData)

            // Verifica se é uma linha válida (tem data)
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
