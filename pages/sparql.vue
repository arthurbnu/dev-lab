<template>
  <main class="min-h-screen">
    <AppHeader class="mb-12" title="Sparql" :description="description" />
    <div class="space-y-4">
      <div v-for="(project, id) in random" :key="id">
        {{ project.title  }}
      </div>
    </div>
    <!-- quasar qbtn -->
    <q-btn
      color="primary"
      label="Primary"
      icon-right="send"
      @click="console.log('clicked')"
    />
  </main>
</template>

<script setup>
const description = "Sparql | A B";
useSeoMeta({
  title: "Sparql | A B",
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
