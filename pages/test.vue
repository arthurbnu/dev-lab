<template>
  <main class="min-h-screen">
    <AppHeader class="mb-1 text-center" :title="title" :description="description" />

    <div class="space-y-4 text-center">
      <span v-for="(tag, id) in tags" :key="id"
        class="bg-teal-800 text-white px-1 mr-2 inline-block hover:bg-teal-600 transition-all border-teal-950">
        {{ tag }}
      </span>
    </div>
    <button v-if="!ready" @click="ready = true">Click to lazy load Octant component</button>
    <LazyAppOctantView v-if="ready" />

    <!-- <ul class="mb-7" > -->
      <!-- <transition-fade group> -->
        <VueDraggableNext class="dragArea list-group w-full mb-5" :list="items" @change="console.log" tag = "ul"
        v-bind="dragOptions"
        @start="isDragging = true"
        @end="isDragging = false">
          <transition-group>

          <!-- <li v-for="item in items" :key="item" @click="removeItem(item)" class = "list-group-item text-2xl"> -->
          <li v-for="item in items" :key="item" class = "list-group-item text-2xl">
            {{ item.name }}
          </li>
        </transition-group>

        </VueDraggableNext>
      <!-- </transition-fade> -->
    <!-- </ul> -->

    <!-- <ul>
      <transition-fade group>
        <li v-for="item in items" :key="item" @click="removeItem(item)">
          {{ item }}
        </li>
      </transition-fade>
    </ul> -->
  </main>
</template>

<script setup>

import { ref, watchEffect, onMounted } from 'vue'

import { VueDraggableNext } from 'vue-draggable-next'

console.log('test draggable')

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

// test v auto animate
// const items = ref(["😏", "😐", "😑", "😒", "😕"])
// same but with name and order
const items = ref([{name: "😏", order: 1}, {name: "😐", order: 2}, {name: "😑", order: 3}, {name: "😒", order: 4}, {name: "😕", order: 5}])
function removeItem(toRemove) {
  items.value = items.value.filter((item) => item !== toRemove)
}

const ready = ref(false)
const mounted = ref(false)

watchEffect(() => {
  if (process.client && mounted.value) {
    console.log('client')
    ready.value = true
  }
})

onMounted(async () => {
  await nextTick()
  mounted.value = true
});

const title = "Recherche sparql avec VueJs";
const description = "Sparql | Langage de requête pour les données liées rdf." +
  " Les données de la requête sont issues de wikidata, et complétées par des données de dbpedia et l'api wikipedia.";

useSeoMeta({
  // title: title,
  // description,
  author: "A B",
});

const tags = [
  "sparql",
  "wikipedia",
  "dbpedia",
  "wikidata",
  "rdf",
  "api",
  "vuejs",
  "nuxt",
];


</script>