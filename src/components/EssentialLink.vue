<template>
  <q-item
    clickable
    :to="isInternalLink ? props.link : undefined"
    :href="!isInternalLink ? props.link : undefined"
    :target="!isInternalLink ? '_blank' : undefined"
    :active="props.active"
    active-class="bg-primary text-white"
  >
    <q-item-section v-if="props.icon" avatar>
      <q-icon :name="props.icon" :style="iconStyle" />
    </q-item-section>

    <q-item-section>
      <q-item-label :class="{ 'text-weight-medium': true }">
        {{ props.title }}
      </q-item-label>
      <q-item-label v-if="props.caption" caption>
        {{ props.caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    default: '',
  },
  link: {
    type: String,
    default: '#',
  },
  icon: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '',
  },
  active: {
    type: Boolean,
    default: false,
  },
})

const isInternalLink = computed(() => {
  return props.link.startsWith('/')
})

const iconStyle = computed(() => {
  if (props.color) {
    return { color: props.color }
  }
  return {}
})
</script>
