<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header Moderno -->
    <q-header elevated class="bg-white text-dark" style="border-bottom: 1px solid #e8e8e3">
      <q-toolbar class="q-px-lg" style="min-height: 70px">
        <!-- Logo e Nome -->
        <router-link
          :to="`/${route.params.condominio}`"
          class="row items-center no-decoration text-dark"
        >
          <!-- Logo do Condomínio -->
          <div class="logo-wrapper q-mr-md">
            <img
              v-if="store.condominioConfig?.logo"
              :src="store.condominioConfig.logo"
              :alt="store.nomeCondominio"
              class="header-logo"
              @error="$event.target.style.display = 'none'"
            />
            <div v-else class="logo-fallback" :style="{ background: store.cores.primary }">
              <q-icon name="apartment" size="24px" color="white" />
            </div>
          </div>

          <div class="column">
            <span
              class="text-h6 text-weight-bold"
              style="
                font-family: 'Playfair Display', Georgia, serif;
                letter-spacing: -0.5px;
                color: #2c3e2c;
              "
            >
              {{ store.nomeCondominio || 'Village Novus' }}
            </span>
          </div>
        </router-link>

        <q-space />

        <!-- Menu de Navegação Horizontal (Âncoras) -->
        <div class="gt-sm row items-center q-gutter-x-lg">
          <a
            v-for="item in menuItems"
            :key="item.id"
            href="#"
            class="nav-link"
            :class="{ active: activeSection === item.id }"
            @click.prevent="scrollToSection(item.id)"
          >
            {{ item.label }}
          </a>
        </div>

        <!-- Menu Mobile -->
        <q-btn flat dense round icon="menu" class="lt-md" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <!-- Drawer Mobile -->
    <q-drawer v-model="rightDrawerOpen" side="right" bordered class="bg-white">
      <q-list class="q-py-md">
        <q-item-label header class="text-weight-bold q-pb-lg">
          <div class="row items-center">
            <!-- Logo no Drawer -->
            <div class="logo-wrapper q-mr-sm">
              <img
                v-if="store.condominioConfig?.logo"
                :src="store.condominioConfig.logo"
                :alt="store.nomeCondominio"
                class="drawer-logo"
                @error="$event.target.style.display = 'none'"
              />
              <div v-else class="logo-fallback" :style="{ background: store.cores.primary }">
                <q-icon name="apartment" size="18px" color="white" />
              </div>
            </div>
            <span style="font-family: 'Playfair Display', Georgia, serif">
              {{ store.nomeCondominio }}
            </span>
          </div>
        </q-item-label>

        <q-item
          v-for="item in menuItems"
          :key="item.id"
          clickable
          :active="activeSection === item.id"
          active-class="bg-grey-2"
          @click="handleMobileMenuClick(item.id)"
        >
          <q-item-section>
            <q-item-label class="text-weight-medium">{{ item.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Page Container -->
    <q-page-container class="page-container">
      <router-view v-slot="{ Component }">
        <transition appear enter-active-class="animated fadeIn">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>

    <!-- Footer Simples -->
    <q-footer class="bg-dark text-white" style="background: #2c3e2c !important">
      <div class="row items-center justify-center q-py-md q-px-md">
        <span class="text-caption">
          © {{ new Date().getFullYear() }} {{ store.nomeCondominio }} — Todos os direitos reservados
        </span>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCondominioStore } from 'src/stores/condominioStore'

const route = useRoute()
const router = useRouter()
const store = useCondominioStore()

const rightDrawerOpen = ref(false)
const activeSection = ref('inicio')

// Menu com IDs para navegação por âncoras
const menuItems = [
  { label: 'Início', id: 'inicio' },
  { label: 'Avisos', id: 'avisos' },
  { label: 'Eventos', id: 'eventos' },
  { label: 'FAQ', id: 'faq' },
  { label: 'Sobre', id: 'sobre' },
]

function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value
}

// Scroll suave para seção
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId)
  if (element) {
    const offset = 80 // altura do header
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })
  }
}

// Handler para clique no menu mobile
function handleMobileMenuClick(sectionId) {
  scrollToSection(sectionId)
  rightDrawerOpen.value = false
}

// Observer para detectar seção ativa durante scroll
let observer = null

function setupIntersectionObserver() {
  const options = {
    root: null,
    rootMargin: '-80px 0px -50% 0px',
    threshold: 0,
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id
      }
    })
  }, options)

  // Observar todas as seções
  menuItems.forEach((item) => {
    const element = document.getElementById(item.id)
    if (element) {
      observer.observe(element)
    }
  })
}

// Carrega configuração do condomínio quando a rota muda
watch(
  () => route.params.condominio,
  async (novoSlug) => {
    if (novoSlug) {
      const valido = store.setCondominio(novoSlug)
      if (!valido) {
        router.push('/404')
        return
      }
      await store.carregarDados()
    }
  },
  { immediate: true },
)

onMounted(() => {
  // Define as variáveis CSS das cores do condomínio
  const root = document.documentElement
  watch(
    () => store.cores,
    (cores) => {
      root.style.setProperty('--q-primary', cores.primary)
      root.style.setProperty('--q-secondary', cores.secondary)
    },
    { immediate: true, deep: true },
  )

  // Setup observer após um pequeno delay para garantir que o DOM está pronto
  setTimeout(setupIntersectionObserver, 500)
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

.page-container {
  background: #f8f7f4;
  min-height: calc(100vh - 70px - 50px);
}

.logo-wrapper {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #e8e8e3;
}

.header-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.drawer-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo-fallback {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-decoration {
  text-decoration: none;
}

.nav-link {
  text-decoration: none;
  color: #5a6358;
  font-weight: 500;
  font-size: 0.95rem;
  padding: 8px 4px;
  position: relative;
  transition: color 0.3s ease;
  font-family: 'Inter', sans-serif;
}

.nav-link:hover {
  color: #4a5d23;
}

.nav-link.active {
  color: #4a5d23;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #4a5d23;
  border-radius: 2px;
}
</style>
