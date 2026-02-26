<template>
  <q-page class="q-py-xl q-px-md" style="background: #f8f7f4">
    <div class="container" style="max-width: 900px; margin: 0 auto">
      <!-- Header -->
      <div class="q-mb-xl">
        <h1
          class="text-h3 text-weight-bold q-mb-sm"
          style="font-family: 'Playfair Display', Georgia, serif; color: #2c3e2c"
        >
          Perguntas Frequentes
        </h1>
        <p class="text-body1 text-weight-light" style="color: #5a6358">
          Encontre respostas para as dúvidas mais comuns dos moradores.
        </p>
      </div>

      <!-- Loading -->
      <div v-if="store.loading" class="flex flex-center q-py-xl">
        <q-spinner color="primary" size="3em" />
        <span class="q-ml-md text-h6" style="color: #5a6358">Carregando FAQ...</span>
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

      <!-- Lista de FAQ -->
      <div v-else-if="store.faq.length > 0" class="column q-gutter-md">
        <q-expansion-item
          v-for="(item, index) in store.faq"
          :key="item.id"
          group="faq"
          :default-opened="index === 0"
          class="faq-item"
          header-class="faq-header"
          style="border-radius: 12px; background: white"
        >
          <template v-slot:header>
            <q-item-section>
              <span
                class="text-subtitle1"
                style="
                  font-family: 'Playfair Display', Georgia, serif;
                  color: #2c3e2c;
                  font-weight: 500;
                "
              >
                {{ item.pergunta }}
              </span>
            </q-item-section>
          </template>

          <q-card flat style="background: transparent">
            <q-card-section class="q-pt-none q-pb-lg q-px-lg">
              <p class="text-body2" style="color: #5a6358; line-height: 1.7; white-space: pre-line">
                {{ item.resposta }}
              </p>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="flex flex-center column q-py-xl"
        style="background: white; border-radius: 16px; padding: 60px"
      >
        <q-icon name="help_outline" size="64px" style="color: #c5ccc0" />
        <p class="text-h6 q-mt-md" style="color: #5a6358">Nenhuma pergunta cadastrada</p>
        <p class="text-body2" style="color: #8a9285">Volte mais tarde para novidades</p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useCondominioStore } from 'src/stores/condominioStore'

const store = useCondominioStore()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');

.container {
  max-width: 900px;
  margin: 0 auto;
}

.faq-item {
  border: 1px solid #e8e8e3;
  transition: all 0.3s ease;
}

.faq-item:hover {
  border-color: #d0d5c8;
  box-shadow: 0 4px 20px rgba(74, 93, 35, 0.06);
}

:deep(.faq-header) {
  padding: 20px 24px;
}

:deep(.q-expansion-item__toggle-icon) {
  color: #4a5d23;
}
</style>
