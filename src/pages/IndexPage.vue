<template>
  <q-page class="q-py-xl q-px-md" style="background: #f8f7f4; min-height: calc(100vh - 140px)">
    <div class="container" style="max-width: 1200px; margin: 0 auto">
      <!-- Hero Section -->
      <div class="text-center q-mb-xl">
        <h1
          class="text-h3 text-weight-bold q-mb-md"
          style="font-family: 'Playfair Display', Georgia, serif; color: #2c3e2c"
        >
          Selecione seu Condomínio
        </h1>
        <p class="text-body1" style="color: #5a6358; max-width: 500px; margin: 0 auto">
          Acesse o portal do seu condomínio para visualizar avisos, eventos e informações
          importantes.
        </p>
      </div>

      <!-- Grid de Condomínios -->
      <div v-if="condominios.length > 0" class="row q-col-gutter-xl justify-center">
        <div v-for="cond in condominios" :key="cond.slug" class="col-12 col-sm-6 col-md-5 col-lg-4">
          <q-card
            class="condominio-card cursor-pointer"
            flat
            bordered
            @click="acessarCondominio(cond.slug)"
            style="border-radius: 20px; border-color: #e8e8e3"
          >
            <q-card-section class="q-pa-xl text-center">
              <!-- Logo -->
              <div class="logo-container q-mb-lg" :style="{ borderColor: cond.cores.primary }">
                <img
                  v-if="cond.logo"
                  :src="cond.logo"
                  :alt="cond.nome"
                  class="condominio-logo"
                  @error="onLogoError"
                />
                <q-icon
                  v-else
                  name="apartment"
                  size="48px"
                  :style="{ color: cond.cores.primary }"
                />
              </div>

              <!-- Nome -->
              <h2
                class="text-h5 text-weight-bold q-mb-sm"
                style="font-family: 'Playfair Display', Georgia, serif; color: #2c3e2c"
              >
                {{ cond.nome }}
              </h2>

              <!-- Endereço -->
              <p class="text-body2 q-mb-lg" style="color: #8a9285">
                {{ cond.endereco.bairro }}, {{ cond.endereco.cidade }}
              </p>

              <!-- Botão -->
              <q-btn
                unelevated
                no-caps
                :style="{ background: cond.cores.primary, color: '#fff', borderRadius: '10px' }"
                label="Acessar Portal"
                icon-right="arrow_forward"
                class="q-px-lg"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center q-py-xl">
        <q-icon name="apartment" size="64px" style="color: #c5ccc0" />
        <p class="text-h6 q-mt-md" style="color: #5a6358">Nenhum condomínio cadastrado</p>
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

function onLogoError(event) {
  console.warn('Logo não encontrada. Verifique se o arquivo existe em public/logos/')
  event.target.style.display = 'none'
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.condominio-card {
  background: white;
  transition: all 0.3s ease;
}

.condominio-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(74, 93, 35, 0.12);
  border-color: #d0d5c8;
}

.logo-container {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  overflow: hidden;
  background: white;
}

.condominio-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 12px;
}
</style>
