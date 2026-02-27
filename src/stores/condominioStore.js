import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getCondominioConfig,
  condominioExiste,
} from 'src/config/condominios'
import {
  fetchAvisos,
  fetchEventos,
  fetchFAQ,
  fetchProfissionais,
} from 'src/services/sheetsService'

export const useCondominioStore = defineStore('condominio', () => {
  // State
  const condominioSlug = ref('')
  const condominioConfig = ref(null)
  const avisos = ref([])
  const eventos = ref([])
  const faq = ref([])
  const profissionais = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isCondominioValido = computed(() => condominioConfig.value !== null)

  const cores = computed(() => {
    return (
      condominioConfig.value?.cores || {
        primary: '#1976d2',
        secondary: '#26a69a',
        accent: '#9c27b0',
        background: '#f5f5f5',
        surface: '#ffffff',
        text: '#2c3e50',
        textLight: '#718096',
      }
    )
  })

  const nomeCondominio = computed(() => condominioConfig.value?.nome || '')

  const endereco = computed(() => condominioConfig.value?.endereco || null)

  const contato = computed(() => condominioConfig.value?.contato || null)

  const planilhas = computed(() => condominioConfig.value?.planilhas || null)

  // Avisos recentes ordenados por data_publicacao
  const avisosRecentes = computed(() => {
    return [...avisos.value]
      .sort((a, b) => new Date(b.dataPublicacao) - new Date(a.dataPublicacao))
      .slice(0, 5)
  })

  // Eventos próximos ordenados por data
  const eventosProximos = computed(() => {
    const hoje = new Date()
    return [...eventos.value]
      .filter((e) => {
        // Se data for "a definir" ou similar, mostrar mesmo assim
        if (!e.data || e.data.toLowerCase().includes('definir')) return true
        const dataEvento = new Date(e.data)
        return !isNaN(dataEvento.getTime()) && dataEvento >= hoje
      })
      .sort((a, b) => {
        const dataA = new Date(a.data)
        const dataB = new Date(b.data)
        // Se data inválida, colocar no final
        if (isNaN(dataA.getTime())) return 1
        if (isNaN(dataB.getTime())) return -1
        return dataA - dataB
      })
      .slice(0, 5)
  })

  // Tipos de serviço únicos dos profissionais
  const tiposServico = computed(() => {
    const tipos = new Set(profissionais.value.map((p) => p.tipoServico).filter(Boolean))
    return Array.from(tipos).sort()
  })

  // Actions
  function setCondominio(slug) {
    if (!slug || !condominioExiste(slug)) {
      condominioConfig.value = null
      condominioSlug.value = ''
      return false
    }

    condominioSlug.value = slug
    condominioConfig.value = getCondominioConfig(slug)
    return true
  }

  async function carregarDados() {
    if (!condominioConfig.value) {
      error.value = 'Condomínio não configurado'
      return
    }

    loading.value = true
    error.value = null

    try {
      const { planilhas: urls } = condominioConfig.value

      // Carrega dados principais (avisos, eventos, faq)
      const [avisosData, eventosData, faqData] = await Promise.all([
        urls.avisos ? fetchAvisos(urls.avisos) : Promise.resolve([]),
        urls.eventos ? fetchEventos(urls.eventos) : Promise.resolve([]),
        urls.faq ? fetchFAQ(urls.faq) : Promise.resolve([]),
      ])

      avisos.value = avisosData
      eventos.value = eventosData
      faq.value = faqData

      // Carrega profissionais separadamente (não bloqueia os outros dados)
      if (urls.profissionais) {
        try {
          const profissionaisData = await fetchProfissionais(urls.profissionais)
          profissionais.value = profissionaisData
        } catch (profErr) {
          console.warn('Erro ao carregar profissionais (não crítico):', profErr)
          profissionais.value = []
        }
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
      error.value = 'Falha ao carregar dados do condomínio'
    } finally {
      loading.value = false
    }
  }

  function limparDados() {
    avisos.value = []
    eventos.value = []
    faq.value = []
    profissionais.value = []
    error.value = null
  }

  return {
    // State
    condominioSlug,
    condominioConfig,
    avisos,
    eventos,
    faq,
    profissionais,
    loading,
    error,

    // Getters
    isCondominioValido,
    cores,
    nomeCondominio,
    endereco,
    contato,
    planilhas,
    avisosRecentes,
    eventosProximos,
    tiposServico,

    // Actions
    setCondominio,
    carregarDados,
    limparDados,
  }
})
