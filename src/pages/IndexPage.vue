<template>
  <q-page class="flex flex-center bg-grey-2">
    <div class="container q-pa-md" style="max-width: 1200px; width: 100%">
      <!-- Header -->
      <div class="text-center q-mb-xl">
        <q-icon name="apartment" size="80px" color="primary" class="q-mb-md" />
        <h1 class="text-h2 text-weight-bold text-primary q-mb-sm">Murais de Condomínios</h1>
        <p class="text-h6 text-grey-7">Plataforma de comunicação para condomínios residenciais</p>
      </div>

      <!-- Condomínios Disponíveis -->
      <div class="q-mb-xl">
        <h2 class="text-h4 text-weight-bold text-center q-mb-lg">Selecione seu Condomínio</h2>

        <div v-if="condominios.length > 0" class="row q-col-gutter-lg justify-center">
          <div v-for="cond in condominios" :key="cond.slug" class="col-12 col-sm-6 col-md-4">
            <q-card
              class="condominio-card cursor-pointer"
              @click="acessarCondominio(cond.slug)"
              :style="{ borderTop: `4px solid ${cond.cores.primary}` }"
            >
              <q-card-section class="text-center q-pa-lg">
                <div class="condominio-icon q-mb-md" :style="{ background: cond.cores.primary }">
                  <q-icon name="apartment" size="40px" color="white" />
                </div>
                <h3 class="text-h5 text-weight-bold q-mb-sm" :style="{ color: cond.cores.text }">
                  {{ cond.nome }}
                </h3>
                <p class="text-body2 text-grey-7 q-mb-md">
                  {{ cond.endereco.bairro }}, {{ cond.endereco.cidade }}
                </p>
                <q-btn
                  unelevated
                  :style="{ background: cond.cores.primary, color: '#fff' }"
                  label="Acessar Mural"
                  icon-right="arrow_forward"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div v-else class="text-center q-py-xl">
          <q-icon name="apartment" size="64px" color="grey-4" />
          <p class="text-h6 text-grey q-mt-md">Nenhum condomínio cadastrado</p>
        </div>
      </div>

      <!-- Como Funciona -->
      <div class="q-mt-xl">
        <h2 class="text-h4 text-weight-bold text-center q-mb-lg">Como Funciona</h2>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-card class="feature-card text-center q-pa-md">
              <q-icon name="campaign" size="48px" color="primary" class="q-mb-md" />
              <h3 class="text-h6 text-weight-bold">Avisos</h3>
              <p class="text-body2 text-grey-7">
                Comunicados importantes e informações da administração
              </p>
            </q-card>
          </div>
          <div class="col-12 col-md-4">
            <q-card class="feature-card text-center q-pa-md">
              <q-icon name="event" size="48px" color="secondary" class="q-mb-md" />
              <h3 class="text-h6 text-weight-bold">Eventos</h3>
              <p class="text-body2 text-grey-7">Calendário de eventos e atividades do condomínio</p>
            </q-card>
          </div>
          <div class="col-12 col-md-4">
            <q-card class="feature-card text-center q-pa-md">
              <q-icon name="help_outline" size="48px" color="accent" class="q-mb-md" />
              <h3 class="text-h6 text-weight-bold">FAQ</h3>
              <p class="text-body2 text-grey-7">Perguntas frequentes e dúvidas dos moradores</p>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center q-mt-xl q-pt-lg text-grey">
        <p class="text-caption">
          © {{ new Date().getFullYear() }} Murais de Condomínios - Todos os direitos reservados
        </p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getTodosCondominios } from 'src/config/condominios'

const router = useRouter()

const condominios = computed(() => getTodosCondominios())

function acessarCondominio(slug) {
  router.push(`/${slug}`)
}
</script>

<style scoped>
.condominio-card {
  transition: all 0.3s ease;
  border-radius: 12px;
}
.condominio-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}
.condominio-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}
.feature-card {
  transition: all 0.2s ease;
  border-radius: 12px;
}
.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}
</style>
