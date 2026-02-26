<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header Simples -->
    <q-header elevated class="bg-white text-dark" style="border-bottom: 1px solid #e8e8e3">
      <q-toolbar class="q-px-lg" style="min-height: 70px">
        <q-toolbar-title>
          <span
            class="text-h6 text-weight-bold"
            style="font-family: 'Playfair Display', Georgia, serif; color: #2c3e2c"
          >
            Murais de Condomínios
          </span>
        </q-toolbar-title>
        <span class="text-caption" style="color: #8a9285">Portal do Morador</span>
      </q-toolbar>
    </q-header>

    <!-- Page Container -->
    <q-page-container style="background: #f8f7f4">
      <router-view />
    </q-page-container>

    <!-- Footer -->
    <q-footer class="bg-white" style="border-top: 1px solid #e8e8e3">
      <div class="row items-center justify-center q-py-md q-px-md">
        <span class="text-caption" style="color: #8a9285">
          © {{ new Date().getFullYear() }} Murais de Condomínios — Todos os direitos reservados
        </span>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
// Layout simples para páginas públicas (hub, landing, etc)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');
</style>
