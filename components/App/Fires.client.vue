<template>
  <Fireworks ref="fw" :autostart="false" :options="options" :style="{
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    position: 'fixed',
    background: '#000'
  }" />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Fireworks } from '@fireworks-js/vue'
import type { FireworksOptions } from '@fireworks-js/vue'

const fw = ref<InstanceType<typeof Fireworks>>()
const options = ref<FireworksOptions>({ opacity: 0.5 })

async function startFireworks() {
  if (!fw.value) return
  fw.value.start()
  await new Promise((resolve) => setTimeout(resolve, 4000))
  if (!fw.value) return   // l'utilisateur peut avoir cliqué sur stop
  await fw.value.waitStop()
}

watch(fw, () => startFireworks())
</script>

 