<template>
  <q-page class="q-py-xl q-px-md" style="background: #f8f7f4">
    <div class="container" style="max-width: 1200px; margin: 0 auto">
      <!-- Header -->
      <div class="q-mb-xl">
        <h1
          class="text-h3 text-weight-bold q-mb-sm"
          style="font-family: 'Playfair Display', Georgia, serif; color: #2c3e2c"
        >
          Eventos
        </h1>
        <p class="text-body1 text-weight-light" style="color: #5a6358">
          Confira os próximos eventos do condomínio.
        </p>
      </div>

      <!-- Loading -->
      <div v-if="store.loading" class="flex flex-center q-py-xl">
        <q-spinner color="primary" size="3em" />
        <span class="q-ml-md text-h6" style="color: #5a6358">Carregando eventos...</span>
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

      <!-- Grid de Eventos -->
      <div v-else-if="eventosOrdenados.length > 0" class="row q-col-gutter-lg">
        <div v-for="evento in eventosOrdenados" :key="evento.id" class="col-12 col-md-6 col-lg-4">
          <q-card
            class="evento-card"
            flat
            bordered
            style="border-radius: 16px; border-color: #e8e8e3"
          >
            <q-card-section class="q-pa-lg">
              <!-- Título -->
              <h3
                class="text-h6 text-weight-bold q-mb-md"
                style="
                  font-family: 'Playfair Display', Georgia, serif;
                  color: #2c3e2c;
                  line-height: 1.3;
                "
              >
                {{ evento.titulo }}
              </h3>

              <!-- Descrição -->
              <p class="text-body2 q-mb-lg" style="color: #5a6358; line-height: 1.6">
                {{ truncarTexto(evento.descricao, 150) }}
              </p>

              <!-- Informações -->
              <div class="column q-gutter-y-sm">
                <!-- Data -->
                <div v-if="evento.data" class="row items-center">
                  <q-icon
                    name="calendar_today"
                    size="18px"
                    class="q-mr-sm"
                    style="color: #6b7f4e"
                  />
                  <span class="text-body2" style="color: #4a5d23; font-weight: 500">
                    {{ formatarData(evento.data) }}
                  </span>
                </div>

                <!-- Horário -->
                <div v-if="evento.horario" class="row items-center">
                  <q-icon name="schedule" size="18px" class="q-mr-sm" style="color: #6b7f4e" />
                  <span class="text-body2" style="color: #5a6358">{{ evento.horario }}</span>
                </div>

                <!-- Local -->
                <div v-if="evento.local" class="row items-center">
                  <q-icon name="place" size="18px" class="q-mr-sm" style="color: #6b7f4e" />
                  <span class="text-body2" style="color: #5a6358">{{ evento.local }}</span>
                </div>
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
        <q-icon name="event_busy" size="64px" style="color: #c5ccc0" />
        <p class="text-h6 q-mt-md" style="color: #5a6358">Nenhum evento programado</p>
        <p class="text-body2" style="color: #8a9285">Volte mais tarde para novidades</p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useCondominioStore } from 'src/stores/condominioStore'

const store = useCondominioStore()

const eventosOrdenados = computed(() => {
  return [...store.eventos].sort((a, b) => {
    return new Date(a.data) - new Date(b.data)
  })
})

function formatarData(dataString) {
  if (!dataString || dataString.toLowerCase().includes('definir')) return dataString
  const data = new Date(dataString)
  if (isNaN(data.getTime())) return dataString
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function truncarTexto(texto, limite) {
  if (!texto) return ''
  if (texto.length <= limite) return texto
  return texto.substring(0, limite).trim() + '...'
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.evento-card {
  background: white;
  transition: all 0.3s ease;
  height: 100%;
}

.evento-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(74, 93, 35, 0.08);
  border-color: #d0d5c8;
}
</style>
