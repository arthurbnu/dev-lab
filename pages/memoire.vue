<template>
  <main class="min-h-screen">
    <AppHeader class="mb-1 text-center" :title="title" :description="description" />

    <div class="space-y-4 text-center">
      <span v-for="(tag, id) in tags" :key="id" 
      class = "bg-teal-800 text-white px-1 mr-2 inline-block hover:bg-teal-600 transition-all border-teal-950" >
        {{ tag }}
      </span>
    </div>

    
  </main>
</template>

<script setup>
const title  = "Objectif mémoire";
const description = "Mémoire | Objectif : 20/20 | 2024 ";

useSeoMeta({
  title: title,
  description,
  author: "A B",
  ogImage: "https://dev-lab-one.vercel.app/sparql/sparql-vuejs-personnes-wikipedia.png",
  ogUrl: "https://dev-lab-one.vercel.app/sparql",
  ogType: "website",
  ogTitle: title,
  ogDescription: description,
  robots: "index, follow",
  themeColor: "teal",
});

const tags = [
  "trop forte",
  "intelligente",
  "douée",
  "lâche rien", 
  "bientôt le mariage",
];


</script>