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
} from 'src/services/sheetsService'

export const useCondominioStore = defineStore('condominio', () => {
  // State
  const condominioSlug = ref('')
  const condominioConfig = ref(null)
  const avisos = ref([])
  const eventos = ref([])
  const faq = ref([])
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

  const avisosRecentes = computed(() => {
    return [...avisos.value]
      .sort((a, b) => new Date(b.data) - new Date(a.data))
      .slice(0, 5)
  })

  const eventosProximos = computed(() => {
    const hoje = new Date()
    return [...eventos.value]
      .filter((e) => new Date(e.dataInicio) >= hoje)
      .sort((a, b) => new Date(a.dataInicio) - new Date(b.dataInicio))
      .slice(0, 5)
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

      const [avisosData, eventosData, faqData] = await Promise.all([
        urls.avisos ? fetchAvisos(urls.avisos) : Promise.resolve([]),
        urls.eventos ? fetchEventos(urls.eventos) : Promise.resolve([]),
        urls.faq ? fetchFAQ(urls.faq) : Promise.resolve([]),
      ])

      avisos.value = avisosData
      eventos.value = eventosData
      faq.value = faqData
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
    error.value = null
  }

  return {
    // State
    condominioSlug,
    condominioConfig,
    avisos,
    eventos,
    faq,
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

    // Actions
    setCondominio,
    carregarDados,
    limparDados,
  }
})
