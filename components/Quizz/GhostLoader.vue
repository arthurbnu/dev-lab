<template>
  <div class="animate-pulse flex justify-around relative" :class="{'hidden' : !ready}">
    <!-- <div class="absolute flex justify-center items-center w-full h-40 opacity-20 text-[30px] z-10 tracking-widest">Chargement des tableaux</div> -->
    <div  v-for="index in range" :key="index + 'i'" >
      <div class="relative w-24 h-28 rounded flex justify-center items-center mb-10 bg-slate-400 border-slate-200 border-4">
        <!-- <div class="h-16 w-16 bg-gray-300 rounded-full "></div> -->
      </div>
        <div class="h-4 w-24 rounded bg-teal-500 flex  justify-center items-center">
          <div class = "w-12 h-1 bg-white/40"></div>
        </div>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted} from 'vue'

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