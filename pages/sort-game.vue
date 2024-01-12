<template>
  <main class="min-h-screen">
    <AppHeader class="mb-10 text-center" :title="title" :description="description" />

    <div class = "relative">

      <VueDraggableNext class="dragArea list-group mb-5 max-w-xs m-auto" :list="items" @change="console.log" tag="ul"
      v-bind="dragOptions" @start="isDragging = true" @end="isDragging = false">
      <transition-group>
        <li v-for="item in items" :key="item" class="list-group-item text-2xl mb-5 cursor-move hover:opacity-80  grid place-items-center">
          <!-- <div v-if = "item.src"> -->
            <img :src="item.src" alt="image" class="w-1/2" />
            <!-- </div> -->
            {{ item.name }}
          </li>
        </transition-group>
      </VueDraggableNext>
      
      <!-- ul in absolute position holding the names of correct result -->
      <ul class = "absolute top-0 right-20 h-full grid place-items-center text-lg">
      <li v-for = "person in people" class = "bg-teal-950 bg-opacity-30 p-3 ">
        {{ person }}
      </li>
    </ul>
  </div>
  </main>
</template>

<script setup>

import { ref, watchEffect, onMounted } from 'vue'

import { VueDraggableNext } from 'vue-draggable-next'

const dragOptions = {
  animation: 200,
  group: 'description',
  ghostClass: 'ghost',
  // disabled: false,
  // chosenClass: 'chosen',
  // dragClass: 'drag',
  // forceFallback: false,
  // fallbackClass: 'fallback',
  // fallbackOnBody: false,
  // lockAxis: 'y',
  // scroll: true,
  // scrollSensitivity: 30,
  // scrollSpeed: 10,
  // sort: true,
  // preventOnFilter: true,
  // put: true,
  // pull: true,
  // delay: 0,
  // touchStartThreshold: 0,
  // bubbleScroll: true,
}

const items = ref([
  { order: 1, src : 'art1.png' }, 
  {order : 2, src : 'art2.png' },
  {order : 3, src : 'art3.png' },
  {order : 4, src : 'art4.png' },
  {order : 5, src : 'art5.png' },
  {order : 6, src : 'art6.png' },
  {order : 7, src : 'art7.png' },
  {order : 8, src : 'art8.png' },
  {order : 9, src : 'art9.png' },
  {order : 10, src : 'art10.png' },
])

const people = [
  'Arthur',
  'François',
  'Christophe',
  'Kevin',
  'Ferdi',
  'Madeleine',
  'Maël',
  'Jimmy',
  'Mathilde',
  'Elisa'
]

const title = "L' IPNI selon l'intelligence artificielle";
const description = "Remettons de l'ordre dans cette équipe ...";

useSeoMeta({
  title: title,
  description,
  author: "A B",
});

</script>