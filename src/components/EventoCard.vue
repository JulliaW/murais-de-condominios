<template>
  <q-card
    :class="['evento-card', { 'evento-passado': passado }]"
    :style="{ background: store.cores.surface, opacity: passado ? 0.7 : 1 }"
  >
    <q-card-section>
      <!-- Data Badge -->
      <div class="row items-center q-mb-md">
        <div
          class="data-badge text-center q-pa-sm"
          :style="{
            background: passado ? '#9e9e9e' : store.cores.accent,
            color: passado ? '#fff' : '#000',
            borderRadius: '8px',
            minWidth: '60px',
          }"
        >
          <div class="text-caption text-uppercase">{{ mes }}</div>
          <div class="text-h5 text-weight-bold">{{ dia }}</div>
        </div>
        <q-space />
        <q-chip
          dense
          size="sm"
          outline
          :style="{ color: store.cores.primary, borderColor: store.cores.primary }"
        >
          {{ evento.categoria }}
        </q-chip>
      </div>

      <!-- Título -->
      <div class="text-h6 text-weight-bold q-mb-sm" :style="{ color: store.cores.text }">
        {{ evento.titulo }}
      </div>

      <!-- Descrição -->
      <div class="text-body2 text-grey-7 q-mb-md" style="white-space: pre-line">
        {{ evento.descricao }}
      </div>

      <!-- Informações -->
      <div class="row items-center q-gutter-y-sm">
        <!-- Horário -->
        <div class="col-12 row items-center">
          <q-icon
            name="schedule"
            size="20px"
            class="q-mr-sm"
            :style="{ color: store.cores.secondary }"
          />
          <span class="text-body2">{{ horario }}</span>
        </div>

        <!-- Local -->
        <div class="col-12 row items-center">
          <q-icon
            name="place"
            size="20px"
            class="q-mr-sm"
            :style="{ color: store.cores.secondary }"
          />
          <span class="text-body2">{{ evento.local }}</span>
        </div>

        <!-- Responsável -->
        <div class="col-12 row items-center">
          <q-icon
            name="person"
            size="20px"
            class="q-mr-sm"
            :style="{ color: store.cores.secondary }"
          />
          <span class="text-body2">{{ evento.responsavel }}</span>
        </div>
      </div>
    </q-card-section>

    <q-separator v-if="!passado" />

    <q-card-actions v-if="!passado" align="right">
      <q-btn
        flat
        dense
        size="sm"
        icon="calendar_today"
        label="Adicionar ao Calendário"
        :style="{ color: store.cores.primary }"
        @click="adicionarAoCalendario"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { useCondominioStore } from 'src/stores/condominioStore'

const props = defineProps({
  evento: {
    type: Object,
    required: true,
  },
  passado: {
    type: Boolean,
    default: false,
  },
})

const store = useCondominioStore()

const dataEvento = computed(() => new Date(props.evento.dataInicio))

const mes = computed(() => {
  const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']
  return meses[dataEvento.value.getMonth()]
})

const dia = computed(() => {
  return String(dataEvento.value.getDate()).padStart(2, '0')
})

const horario = computed(() => {
  const data = dataEvento.value
  const hora = String(data.getHours()).padStart(2, '0')
  const minuto = String(data.getMinutes()).padStart(2, '0')

  if (props.evento.dataFim) {
    const dataFim = new Date(props.evento.dataFim)
    const horaFim = String(dataFim.getHours()).padStart(2, '0')
    const minutoFim = String(dataFim.getMinutes()).padStart(2, '0')
    return `${hora}:${minuto} - ${horaFim}:${minutoFim}`
  }

  return `${hora}:${minuto}`
})

function adicionarAoCalendario() {
  const titulo = encodeURIComponent(props.evento.titulo)
  const descricao = encodeURIComponent(props.evento.descricao)
  const local = encodeURIComponent(props.evento.local)
  const dataInicio = props.evento.dataInicio.replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const dataFim = props.evento.dataFim
    ? props.evento.dataFim.replace(/[-:]/g, '').replace(/\.\d{3}/, '')
    : dataInicio

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titulo}&dates=${dataInicio}/${dataFim}&details=${descricao}&location=${local}`

  window.open(url, '_blank')
}
</script>

<style scoped>
.evento-card {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.evento-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
.evento-passado:hover {
  transform: none;
  box-shadow: none;
}
.data-badge {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
