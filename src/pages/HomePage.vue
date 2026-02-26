<template>
  <q-page style="background: #f8f7f4">
    <!-- Hero Section -->
    <div class="hero-section q-py-xl q-px-md">
      <div class="container" style="max-width: 1200px; margin: 0 auto">
        <div class="row items-center q-col-gutter-xl">
          <div class="col-12 col-md-6">
            <h1
              class="text-h2 text-weight-bold q-mb-md"
              style="
                font-family: 'Playfair Display', Georgia, serif;
                color: #2c3e2c;
                line-height: 1.2;
              "
            >
              Bem-vindo ao<br />{{ store.nomeCondominio }}
            </h1>
            <p
              class="text-body1 q-mb-lg"
              style="color: #5a6358; line-height: 1.7; max-width: 500px"
            >
              Acompanhe aqui todos os avisos, eventos e informações importantes do condomínio.
            </p>
            <div class="row q-gutter-sm">
              <q-btn
                unelevated
                :to="`/${$route.params.condominio}/avisos`"
                label="Ver Avisos"
                icon-right="arrow_forward"
                style="background: #4a5d23; color: white; border-radius: 8px"
              />
              <q-btn
                outline
                :to="`/${$route.params.condominio}/eventos`"
                label="Próximos Eventos"
                style="border-color: #4a5d23; color: #4a5d23; border-radius: 8px"
              />
            </div>
          </div>
          <div class="col-12 col-md-6 flex flex-center">
            <div
              class="hero-image-placeholder"
              style="
                width: 100%;
                max-width: 450px;
                height: 350px;
                background: linear-gradient(135deg, #6b7f4e 0%, #4a5d23 100%);
                border-radius: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <q-icon name="apartment" size="120px" color="white" style="opacity: 0.3" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="flex flex-center q-py-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <!-- Content -->
    <div v-else class="q-py-xl q-px-md">
      <div class="container" style="max-width: 1200px; margin: 0 auto">
        <div class="row q-col-gutter-xl">
          <!-- Avisos Recentes -->
          <div class="col-12 col-md-6">
            <div class="row items-center justify-between q-mb-lg">
              <h2
                class="text-h5 text-weight-bold"
                style="font-family: 'Playfair Display', Georgia, serif; color: #2c3e2c"
              >
                Avisos Recentes
              </h2>
              <q-btn
                flat
                dense
                :to="`/${$route.params.condominio}/avisos`"
                label="Ver todos"
                color="primary"
                icon-right="arrow_forward"
              />
            </div>

            <div v-if="store.avisosRecentes.length > 0" class="column q-gutter-md">
              <q-card
                v-for="aviso in store.avisosRecentes.slice(0, 3)"
                :key="aviso.id"
                flat
                bordered
                class="home-card cursor-pointer"
                style="border-radius: 12px; border-color: #e8e8e3"
                :to="`/${$route.params.condominio}/avisos`"
              >
                <q-card-section class="q-pa-md">
                  <div class="row items-center justify-between q-mb-sm">
                    <span class="text-caption" style="color: #8a9285">
                      {{ formatarData(aviso.dataPublicacao) }}
                    </span>
                  </div>
                  <h3
                    class="text-subtitle1 text-weight-bold"
                    style="font-family: 'Playfair Display', Georgia, serif; color: #2c3e2c"
                  >
                    {{ aviso.titulo }}
                  </h3>
                </q-card-section>
              </q-card>
            </div>

            <q-card
              v-else
              flat
              bordered
              class="home-card"
              style="border-radius: 12px; border-color: #e8e8e3"
            >
              <q-card-section class="q-pa-md text-center">
                <q-icon name="campaign" size="32px" style="color: #c5ccc0" />
                <p class="text-body2 q-mt-sm" style="color: #8a9285">Nenhum aviso recente</p>
              </q-card-section>
            </q-card>
          </div>

          <!-- Próximos Eventos -->
          <div class="col-12 col-md-6">
            <div class="row items-center justify-between q-mb-lg">
              <h2
                class="text-h5 text-weight-bold"
                style="font-family: 'Playfair Display', Georgia, serif; color: #2c3e2c"
              >
                Próximos Eventos
              </h2>
              <q-btn
                flat
                dense
                :to="`/${$route.params.condominio}/eventos`"
                label="Ver todos"
                color="primary"
                icon-right="arrow_forward"
              />
            </div>

            <div v-if="store.eventosProximos.length > 0" class="column q-gutter-md">
              <q-card
                v-for="evento in store.eventosProximos.slice(0, 3)"
                :key="evento.id"
                flat
                bordered
                class="home-card cursor-pointer"
                style="border-radius: 12px; border-color: #e8e8e3"
                :to="`/${$route.params.condominio}/eventos`"
              >
                <q-card-section class="q-pa-md">
                  <h3
                    class="text-subtitle1 text-weight-bold q-mb-sm"
                    style="font-family: 'Playfair Display', Georgia, serif; color: #2c3e2c"
                  >
                    {{ evento.titulo }}
                  </h3>
                  <div class="row items-center q-gutter-x-md">
                    <div class="row items-center">
                      <q-icon
                        name="calendar_today"
                        size="14px"
                        class="q-mr-xs"
                        style="color: #6b7f4e"
                      />
                      <span class="text-caption" style="color: #4a5d23; font-weight: 500">
                        {{ formatarData(evento.data) }}
                      </span>
                    </div>
                    <div v-if="evento.local" class="row items-center">
                      <q-icon name="place" size="14px" class="q-mr-xs" style="color: #8a9285" />
                      <span class="text-caption" style="color: #8a9285">{{ evento.local }}</span>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <q-card
              v-else
              flat
              bordered
              class="home-card"
              style="border-radius: 12px; border-color: #e8e8e3"
            >
              <q-card-section class="q-pa-md text-center">
                <q-icon name="event" size="32px" style="color: #c5ccc0" />
                <p class="text-body2 q-mt-sm" style="color: #8a9285">Nenhum evento próximo</p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useCondominioStore } from 'src/stores/condominioStore'

const store = useCondominioStore()

function formatarData(dataString) {
  if (!dataString || dataString.toLowerCase().includes('definir')) return dataString
  const data = new Date(dataString)
  if (isNaN(data.getTime())) return dataString
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  background: linear-gradient(180deg, #f8f7f4 0%, #f0efe9 100%);
  border-bottom: 1px solid #e8e8e3;
}

.home-card {
  background: white;
  transition: all 0.2s ease;
}

.home-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(74, 93, 35, 0.08);
  border-color: #d0d5c8;
}
</style>
