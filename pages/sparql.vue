<template>
  <main class="min-h-screen">
    <AppHeader class="mb-12" title="Sparql" :description="description" />
    <div class="space-y-4">
      <div v-for="(project, id) in random" :key="id">
        {{ project.title  }}
      </div>
    </div>
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
    description: "A B",
    tags: ["A", "B"],
    links: [
      {
        name: "Github",
        url: ""
      },
    ],
  },
];

// const { data: random } = await useAsyncData("random-all", () =>
//   queryContent("/random").find()
// );
</script>
