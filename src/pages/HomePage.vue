<template>
  <q-page style="background: #f8f7f4">
    <!-- ============================================ -->
    <!-- HERO SECTION -->
    <!-- ============================================ -->
    <section id="inicio" class="hero-section q-py-xl q-px-md">
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
                @click="scrollToSection('avisos')"
                label="Ver Avisos"
                icon-right="arrow_forward"
                style="background: #4a5d23; color: white; border-radius: 8px"
              />
              <q-btn
                outline
                @click="scrollToSection('eventos')"
                label="Próximos Eventos"
                style="border-color: #4a5d23; color: #4a5d23; border-radius: 8px"
              />
            </div>
          </div>
          <div class="col-12 col-md-6 flex flex-center">
            <div
              class="hero-image-container"
              style="
                width: 100%;
                max-width: 450px;
                height: 350px;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(74, 93, 35, 0.15);
              "
            >
              <img
                src="~assets/cond-village.png"
                alt="Village Novus"
                style="width: 100%; height: 100%; object-fit: cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Loading Global -->
    <div v-if="store.loading" class="flex flex-center q-py-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <template v-else>
      <!-- ============================================ -->
      <!-- AVISOS SECTION -->
      <!-- ============================================ -->
      <section id="avisos" class="section-padding q-px-md">
        <div class="container" style="max-width: 1200px; margin: 0 auto">
          <!-- Header -->
          <div class="text-center q-mb-xl">
            <h2
              class="text-h3 text-weight-bold q-mb-sm"
              style="font-family: 'Playfair Display', Georgia, serif; color: #2c3e2c"
            >
              Mural de Avisos
            </h2>
            <p
              class="text-body1 text-weight-light"
              style="color: #5a6358; max-width: 600px; margin: 0 auto"
            >
              Fique por dentro dos comunicados mais recentes do condomínio.
            </p>
          </div>

          <!-- Error -->
          <q-banner
            v-if="store.error"
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
          <template v-if="avisosOrdenados.length > 0">
            <div
              class="row q-col-gutter-lg"
              :class="{ 'justify-center': avisosOrdenados.length < 3 }"
            >
              <div
                v-for="aviso in avisosOrdenados.slice(0, avisosLimit)"
                :key="aviso.id"
                class="col-12 col-md-6 col-lg-4"
              >
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
                      {{ truncarTexto(aviso.descricao, 120) }}
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

            <!-- Ver mais avisos -->
            <div v-if="avisosOrdenados.length > 6" class="text-center q-mt-lg">
              <q-btn
                flat
                :label="avisosLimit === 6 ? 'Ver todos os avisos' : 'Mostrar menos'"
                color="primary"
                icon-right="expand_more"
                @click="toggleAvisosLimit"
              />
            </div>
          </template>

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
      </section>

      <!-- ============================================ -->
      <!-- EVENTOS SECTION -->
      <!-- ============================================ -->
      <section
        id="eventos"
        class="section-padding q-px-md"
        style="background: linear-gradient(180deg, #f0efe9 0%, #f8f7f4 100%)"
      >
        <div class="container" style="max-width: 1200px; margin: 0 auto">
          <!-- Header -->
          <div class="text-center q-mb-xl">
            <h2
              class="text-h3 text-weight-bold q-mb-sm"
              style="font-family: 'Playfair Display', Georgia, serif; color: #2c3e2c"
            >
              Próximos Eventos
            </h2>
            <p
              class="text-body1 text-weight-light"
              style="color: #5a6358; max-width: 600px; margin: 0 auto"
            >
              Confira os próximos eventos do condomínio.
            </p>
          </div>

          <!-- Grid de Eventos -->
          <template v-if="eventosOrdenados.length > 0">
            <div
              class="row q-col-gutter-lg"
              :class="{ 'justify-center': eventosOrdenados.length < 3 }"
            >
              <div
                v-for="evento in eventosOrdenados.slice(0, eventosLimit)"
                :key="evento.id"
                class="col-12 col-md-6 col-lg-4"
              >
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
                      {{ truncarTexto(evento.descricao, 120) }}
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
                        <q-icon
                          name="schedule"
                          size="18px"
                          class="q-mr-sm"
                          style="color: #6b7f4e"
                        />
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

            <!-- Ver mais eventos -->
            <div v-if="eventosOrdenados.length > 6" class="text-center q-mt-lg">
              <q-btn
                flat
                :label="eventosLimit === 6 ? 'Ver todos os eventos' : 'Mostrar menos'"
                color="primary"
                icon-right="expand_more"
                @click="toggleEventosLimit"
              />
            </div>
          </template>

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
      </section>

      <!-- ============================================ -->
      <!-- FAQ SECTION -->
      <!-- ============================================ -->
      <section id="faq" class="section-padding q-px-md">
        <div class="container" style="max-width: 900px; margin: 0 auto">
          <!-- Header -->
          <div class="text-center q-mb-xl">
            <h2
              class="text-h3 text-weight-bold q-mb-sm"
              style="font-family: 'Playfair Display', Georgia, serif; color: #2c3e2c"
            >
              Perguntas Frequentes
            </h2>
            <p
              class="text-body1 text-weight-light"
              style="color: #5a6358; max-width: 600px; margin: 0 auto"
            >
              Encontre respostas para as dúvidas mais comuns dos moradores.
            </p>
          </div>

          <!-- Lista de FAQ -->
          <div v-if="store.faq.length > 0" class="column q-gutter-md">
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
                  <p
                    class="text-body2"
                    style="color: #5a6358; line-height: 1.7; white-space: pre-line"
                  >
                    {{ item.resposta }}
                  </p>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </div>

          <!-- Empty State -->
          <div
            v-else-if="!store.loading"
            class="flex flex-center column q-py-xl"
            style="background: white; border-radius: 16px; padding: 60px"
          >
            <q-icon name="help_outline" size="64px" style="color: #c5ccc0" />
            <p class="text-h6 q-mt-md" style="color: #5a6358">Nenhuma pergunta cadastrada</p>
            <p class="text-body2" style="color: #8a9285">Volte mais tarde para novidades</p>
          </div>
        </div>
      </section>

      <!-- ============================================ -->
      <!-- SOBRE / CONTATO SECTION -->
      <!-- ============================================ -->
      <section
        id="sobre"
        class="section-padding q-px-md"
        style="background: linear-gradient(180deg, #f8f7f4 0%, #f0efe9 100%)"
      >
        <div class="container" style="max-width: 1200px; margin: 0 auto">
          <!-- Header -->
          <div class="text-center q-mb-xl">
            <h2
              class="text-h3 text-weight-bold q-mb-sm"
              style="font-family: 'Playfair Display', Georgia, serif; color: #2c3e2c"
            >
              Sobre o Condomínio
            </h2>
            <p
              class="text-body1 text-weight-light"
              style="color: #5a6358; max-width: 600px; margin: 0 auto"
            >
              Informações de contato e localização do {{ store.nomeCondominio }}
            </p>
          </div>

          <div class="row q-col-gutter-xl">
            <!-- Coluna da Esquerda - Informações -->
            <div class="col-12 col-md-5">
              <!-- Card de Endereço -->
              <q-card
                flat
                bordered
                class="q-mb-lg"
                style="border-radius: 16px; border-color: #e8e8e3; background: white"
              >
                <q-card-section class="q-pa-lg">
                  <div class="row items-center q-mb-md">
                    <q-icon
                      name="location_on"
                      size="28px"
                      class="q-mr-md"
                      :style="{ color: store.cores.primary }"
                    />
                    <h3
                      class="text-h6 text-weight-bold"
                      style="font-family: 'Playfair Display', Georgia, serif; color: #2c3e2c"
                    >
                      Endereço
                    </h3>
                  </div>
                  <p class="text-body1" style="color: #5a6358; line-height: 1.7">
                    {{ enderecoCompleto }}
                  </p>
                  <q-btn
                    flat
                    dense
                    color="primary"
                    icon="open_in_new"
                    label="Ver no Google Maps"
                    class="q-mt-sm"
                    @click="abrirGoogleMaps"
                  />
                </q-card-section>
              </q-card>

              <!-- Card de Contato -->
              <q-card
                flat
                bordered
                style="border-radius: 16px; border-color: #e8e8e3; background: white"
              >
                <q-card-section class="q-pa-lg">
                  <div class="row items-center q-mb-md">
                    <q-icon
                      name="contact_phone"
                      size="28px"
                      class="q-mr-md"
                      :style="{ color: store.cores.primary }"
                    />
                    <h3
                      class="text-h6 text-weight-bold"
                      style="font-family: 'Playfair Display', Georgia, serif; color: #2c3e2c"
                    >
                      Contato
                    </h3>
                  </div>

                  <div class="column q-gutter-y-md">
                    <!-- Email -->
                    <div v-if="store.contato?.email" class="row items-center">
                      <q-icon name="email" size="20px" class="q-mr-md" style="color: #6b7f4e" />
                      <div>
                        <div class="text-caption" style="color: #8a9285">E-mail</div>
                        <a
                          :href="`mailto:${store.contato.email}`"
                          class="text-body2"
                          style="color: #4a5d23; text-decoration: none"
                        >
                          {{ store.contato.email }}
                        </a>
                      </div>
                    </div>

                    <!-- Telefone -->
                    <div v-if="store.contato?.telefone" class="row items-center">
                      <q-icon name="phone" size="20px" class="q-mr-md" style="color: #6b7f4e" />
                      <div>
                        <div class="text-caption" style="color: #8a9285">Telefone</div>
                        <a
                          :href="`tel:${store.contato.telefone.replace(/\D/g, '')}`"
                          class="text-body2"
                          style="color: #4a5d23; text-decoration: none"
                        >
                          {{ store.contato.telefone }}
                        </a>
                      </div>
                    </div>

                    <!-- WhatsApp -->
                    <div v-if="store.contato?.whatsapp" class="row items-center">
                      <q-icon name="chat" size="20px" class="q-mr-md" style="color: #6b7f4e" />
                      <div>
                        <div class="text-caption" style="color: #8a9285">WhatsApp</div>
                        <a
                          :href="`https://wa.me/${store.contato.whatsapp.replace(/\D/g, '')}`"
                          target="_blank"
                          class="text-body2"
                          style="color: #4a5d23; text-decoration: none"
                        >
                          {{ store.contato.whatsapp }}
                        </a>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Coluna da Direita - Mapa -->
            <div class="col-12 col-md-7">
              <q-card
                flat
                bordered
                style="border-radius: 16px; border-color: #e8e8e3; background: white; height: 100%"
              >
                <q-card-section class="q-pa-lg" style="height: 100%">
                  <div class="row items-center q-mb-md">
                    <q-icon
                      name="map"
                      size="28px"
                      class="q-mr-md"
                      :style="{ color: store.cores.primary }"
                    />
                    <h3
                      class="text-h6 text-weight-bold"
                      style="font-family: 'Playfair Display', Georgia, serif; color: #2c3e2c"
                    >
                      Localização
                    </h3>
                  </div>

                  <!-- Mapa do Google Maps -->
                  <div class="map-container">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3534.8761512599262!2d-47.788577624962514!3d-21.236471680465314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b9b8f46212dde5%3A0xbd7d3de5aecff414!2sAv.%20Luiz%20Octavio%20da%20Silva%20Whitaker%2C%202300%20-%20Maubisa%2C%20Ribeir%C3%A3o%20Preto%20-%20SP%2C%2014022-496!5e1!3m2!1spt-BR!2sbr!4v1772133842522!5m2!1spt-BR!2sbr"
                      width="100%"
                      height="100%"
                      style="border: 0; border-radius: 12px"
                      allowfullscreen=""
                      loading="lazy"
                      referrerpolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================ -->
      <!-- BACK TO TOP -->
      <!-- ============================================ -->
      <div class="text-center q-py-xl">
        <q-btn
          flat
          color="primary"
          icon="arrow_upward"
          label="Voltar ao topo"
          @click="scrollToSection('inicio')"
        />
      </div>
    </template>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCondominioStore } from 'src/stores/condominioStore'

const store = useCondominioStore()

// Limites para exibição de cards
const avisosLimit = ref(6)
const eventosLimit = ref(6)

// Computed para ordenação
const avisosOrdenados = computed(() => {
  return [...store.avisos].sort((a, b) => {
    return new Date(b.dataPublicacao) - new Date(a.dataPublicacao)
  })
})

const eventosOrdenados = computed(() => {
  return [...store.eventos].sort((a, b) => {
    const dataA = new Date(a.data)
    const dataB = new Date(b.data)
    if (isNaN(dataA.getTime())) return 1
    if (isNaN(dataB.getTime())) return -1
    return dataA - dataB
  })
})

const enderecoCompleto = computed(() => {
  const end = store.endereco
  if (!end) return ''
  return `${end.rua}, ${end.numero} - ${end.bairro}, ${end.cidade} - ${end.estado}, ${end.cep}`
})

// Funções de scroll suave
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

// Toggle limites
function toggleAvisosLimit() {
  avisosLimit.value = avisosLimit.value === 6 ? avisosOrdenados.value.length : 6
}

function toggleEventosLimit() {
  eventosLimit.value = eventosLimit.value === 6 ? eventosOrdenados.value.length : 6
}

// Helpers
function formatarData(dataString) {
  if (!dataString) return ''
  const data = new Date(dataString)
  if (isNaN(data.getTime())) return dataString
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

function abrirGoogleMaps() {
  const end = store.endereco
  if (!end) return
  const enderecoFormatado = encodeURIComponent(
    `${end.rua}, ${end.numero}, ${end.bairro}, ${end.cidade}, ${end.estado}, ${end.cep}`,
  )
  window.open(`https://www.google.com/maps/search/?api=1&query=${enderecoFormatado}`, '_blank')
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
  padding-top: 60px;
  padding-bottom: 60px;
}

.section-padding {
  padding-top: 80px;
  padding-bottom: 80px;
}

.home-card,
.aviso-card,
.evento-card {
  background: white;
  transition: all 0.3s ease;
}

.aviso-card:hover,
.evento-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(74, 93, 35, 0.08);
  border-color: #d0d5c8;
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

.map-container {
  width: 100%;
  height: 350px;
  border-radius: 12px;
  overflow: hidden;
}

@media (max-width: 767px) {
  .hero-section {
    padding-top: 40px;
    padding-bottom: 40px;
  }

  .section-padding {
    padding-top: 50px;
    padding-bottom: 50px;
  }

  .map-container {
    height: 280px;
  }
}
</style>
