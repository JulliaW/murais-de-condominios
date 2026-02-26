<template>
  <q-page class="q-py-xl q-px-md" style="background: #f8f7f4">
    <div class="container" style="max-width: 1200px; margin: 0 auto">
      <!-- Header -->
      <div class="q-mb-xl">
        <h1
          class="text-h3 text-weight-bold q-mb-sm"
          style="font-family: 'Playfair Display', Georgia, serif; color: #2c3e2c"
        >
          Sobre o Condomínio
        </h1>
        <p class="text-body1 text-weight-light" style="color: #5a6358">
          Informações sobre o {{ store.nomeCondominio }}
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
                <h2
                  class="text-h6 text-weight-bold"
                  style="font-family: 'Playfair Display', Georgia, serif; color: #2c3e2c"
                >
                  Endereço
                </h2>
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
                <h2
                  class="text-h6 text-weight-bold"
                  style="font-family: 'Playfair Display', Georgia, serif; color: #2c3e2c"
                >
                  Contato
                </h2>
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
                <h2
                  class="text-h6 text-weight-bold"
                  style="font-family: 'Playfair Display', Georgia, serif; color: #2c3e2c"
                >
                  Localização
                </h2>
              </div>

              <!-- Mapa do Google Maps -->
              <div class="map-container">
                <iframe
                  :src="mapUrl"
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
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useCondominioStore } from 'src/stores/condominioStore'

const store = useCondominioStore()

const enderecoCompleto = computed(() => {
  const end = store.endereco
  if (!end) return ''
  return `${end.rua}, ${end.numero} - ${end.bairro}, ${end.cidade} - ${end.estado}, ${end.cep}`
})

const mapUrl = computed(() => {
  const end = store.endereco
  if (!end) return ''
  const enderecoFormatado = encodeURIComponent(
    `${end.rua}, ${end.numero}, ${end.bairro}, ${end.cidade}, ${end.estado}, ${end.cep}`,
  )
  return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3737.0!2d-47.8!3d-21.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${enderecoFormatado}!5e0!3m2!1spt-BR!2sbr!4v1`
})

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

.map-container {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
}

@media (max-width: 767px) {
  .map-container {
    height: 300px;
  }
}
</style>
