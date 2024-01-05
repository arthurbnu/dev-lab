<template>
  <main class="min-h-screen">
    <AppHeader class="mb-4 text-center" :title="title" :description="description" />
    <!-- <div class="space-y-4">
      <div v-for="(project, id) in random" :key="id">
        {{ project.title  }}
      </div>
    </div>
    <q-btn
      color="primary"
      label="Primary"
      icon-right="send"
      @click="console.log('clicked')"
    /> -->
    <OctantView />
  </main>
</template>

<script setup>
import OctantView from '~/components/App/OctantView.vue';

const description = "Sparql | A B";
const title  = "Recherche sparql - wikidata ";
useSeoMeta({
  title: title,
  description,
  author: "A B",
});

const random = [
  {
    title: "Sparql",
    id : "1",
  },
];



</script>
