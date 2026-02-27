<template>
  <router-view />
</template>

<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCondominioStore } from 'src/stores/condominioStore'

const route = useRoute()
const store = useCondominioStore()

// Atualiza o título da página dinamicamente baseado na rota
watch(
  () => [route.path, store.nomeCondominio],
  ([path, nomeCondominio]) => {
    let titulo = 'Murais de Condomínios'

    // Se estiver em uma página de condomínio específico
    if (path && path !== '/' && nomeCondominio) {
      titulo = `Murais - ${nomeCondominio}`
    }

    document.title = titulo
  },
  { immediate: true },
)
</script>
