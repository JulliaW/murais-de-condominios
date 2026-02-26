<template>
  <q-page class="q-py-xl q-px-md" style="background: #f8f7f4">
    <div class="container" style="max-width: 1200px; margin: 0 auto">
      <!-- Header -->
      <div class="q-mb-xl">
        <h1
          class="text-h3 text-weight-bold q-mb-sm"
          style="font-family: 'Playfair Display', Georgia, serif; color: #2c3e2c"
        >
          Mural de Avisos
        </h1>
        <p class="text-body1 text-weight-light" style="color: #5a6358">
          Fique por dentro dos comunicados mais recentes do condomínio.
        </p>
      </div>

      <!-- Loading -->
      <div v-if="store.loading" class="flex flex-center q-py-xl">
        <q-spinner color="primary" size="3em" />
        <span class="q-ml-md text-h6" style="color: #5a6358">Carregando avisos...</span>
      </div>

      <!-- Error -->
      <q-banner
        v-else-if="store.error"
        class="q-mb-lg"
        style="background: #fee; color: #c33; border-radius: 12px"
      >
        <template v-slot:avatar>
          <q-icon name="error" color="negative" />
        </template>
        {{ store.error }}
        <template v-slot:action>
          <q-btn flat label="Tentar novamente" @click="store.carregarDados" color="negative" />
        </template>
      </q-banner>

      <!-- Grid de Avisos -->
      <div v-else-if="avisosOrdenados.length > 0" class="row q-col-gutter-lg">
        <div v-for="aviso in avisosOrdenados" :key="aviso.id" class="col-12 col-md-6 col-lg-4">
          <q-card
            class="aviso-card cursor-pointer"
            flat
            bordered
            style="border-radius: 16px; border-color: #e8e8e3"
          >
            <q-card-section class="q-pa-lg">
              <!-- Header do Card -->
              <div class="row items-center justify-between q-mb-md">
                <span class="text-caption text-weight-medium" style="color: #8a9285">
                  {{ formatarData(aviso.dataPublicacao) }}
                </span>
                <q-badge
                  v-if="aviso.prioridade"
                  :color="getPrioridadeColor(aviso.prioridade)"
                  class="q-px-sm q-py-xs"
                  style="border-radius: 6px; font-weight: 500"
                >
                  {{ aviso.prioridade }}
                </q-badge>
              </div>

              <!-- Título -->
              <h3
                class="text-h6 text-weight-bold q-mb-md"
                style="
                  font-family: 'Playfair Display', Georgia, serif;
                  color: #2c3e2c;
                  line-height: 1.3;
                "
              >
                {{ aviso.titulo }}
              </h3>

              <!-- Descrição -->
              <p class="text-body2" style="color: #5a6358; line-height: 1.6">
                {{ truncarTexto(aviso.descricao, 150) }}
              </p>

              <!-- Data de expiração -->
              <div v-if="aviso.dataExpiracao" class="q-mt-md">
                <span class="text-caption" style="color: #8a9285">
                  <q-icon name="event_busy" size="14px" class="q-mr-xs" />
                  Válido até: {{ formatarData(aviso.dataExpiracao) }}
                </span>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="flex flex-center column q-py-xl"
        style="background: white; border-radius: 16px; padding: 60px"
      >
        <q-icon name="campaign" size="64px" style="color: #c5ccc0" />
        <p class="text-h6 q-mt-md" style="color: #5a6358">Nenhum aviso no momento</p>
        <p class="text-body2" style="color: #8a9285">Volte mais tarde para novidades</p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useCondominioStore } from 'src/stores/condominioStore'

const store = useCondominioStore()

const avisosOrdenados = computed(() => {
  return [...store.avisos].sort((a, b) => {
    return new Date(b.dataPublicacao) - new Date(a.dataPublicacao)
  })
})

function formatarData(dataString) {
  if (!dataString) return ''
  const data = new Date(dataString)
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function truncarTexto(texto, limite) {
  if (!texto) return ''
  if (texto.length <= limite) return texto
  return texto.substring(0, limite).trim() + '...'
}

function getPrioridadeColor(prioridade) {
  const cores = {
    alta: 'negative',
    media: 'warning',
    baixa: 'positive',
    urgente: 'negative',
    normal: 'grey',
  }
  return cores[prioridade?.toLowerCase()] || 'grey'
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.aviso-card {
  background: white;
  transition: all 0.3s ease;
  height: 100%;
}

.aviso-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(74, 93, 35, 0.08);
  border-color: #d0d5c8;
}
</style>
