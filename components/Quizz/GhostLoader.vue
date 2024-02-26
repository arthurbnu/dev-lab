<template>
  <div class="animate-pulse flex justify-around relative max-h-44 overflow-hidden gap-7" :class="{ 'hidden': !ready }">
    <div v-for="index in range" :key="index + 'i'">
      <div class="relative w-24 h-28 rounded flex justify-center items-center mb-10 bg-slate-400 border-slate-200 border-4">
        <client-only>
          <Vue3Lottie autoPlay animationLink="/quizz/joconde.json" class="opacity-50" />
        </client-only>
      </div>
      <div class="h-4 w-24 rounded bg-teal-500 flex  justify-center items-center mb-3">
        <div class="w-12 h-1 bg-white/40"></div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { Vue3Lottie } from 'vue3-lottie'

const ready = ref(false)

onMounted(() => {
  setTimeout(() => {
    ready.value = true
  }, 100)
})

const props = defineProps({
  nbItems: {
    type: Number,
    required: true
  }
})

const range = [...Array(props.nbItems).keys()]

</script>