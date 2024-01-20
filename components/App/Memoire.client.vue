<template>
    <main class="min-h-screen">
      <AppHeader class="mb-1 text-center" :title="title" :description="description" />
  
      <div class="space-y-4 text-center mb-5">
        <span v-for="(tag, id) in tags" :key="id"
          class="bg-teal-800 text-white px-1 mr-2 inline-block hover:bg-teal-600 transition-all border-teal-950">
          {{ tag }}
        </span>
      </div>
  
      <div class="flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div class="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
              <table class="min-w-full divide-y divide-gray-200 text-xs">
                <thead class="bg-teal-200 text-black">
                  <tr>
                    <th scope="col" v-for="column in columns" :key="column"
                      class="px-6 py-3  font-medium tracking-wider text-left text-gray-800 uppercase">
                      {{ column }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ nbMots }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <input type="number" v-model="words" class=" text-white" />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ nbSemaines }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ nbMotsRestantsParSemaine }}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  
      <!--  progress bar : transition width according to nb words already written / nb total -->
      <div class="relative pt-1 mt-10">
        Progression...
        <div class="overflow-hidden h-4 mb-4 text-xs flex rounded bg-teal-200">
          <div :style="{ width: (words / nbMots) * 100 + '%' }"
            class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-800 transition-all"></div>
        </div>
      </div>
  
    </main>
  </template>
  
  <script setup lang = "ts">
  
  import { useStorage } from '@vueuse/core'
  
  const title = "Objectif mémoire";
  const description = "Mémoire | Objectif : 20/20 | 2024 ";
  const columns = [
    'Nombre de mots total',
    'Nombre de mots déjà écrits',
    'Nombre de semaines',
    'Mots par semaine'
  ]
  
  const daysBetween = (date1:Date, date2:Date) => {
    // Get 1 day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;
  
    // Convert both dates to milliseconds
    const date1Ms = date1.getTime();
    const date2Ms = date2.getTime();
  
    // Calculate the difference in milliseconds
    const differenceMs = date2Ms - date1Ms;
  
    // Convert back to days and return
    return Math.round(differenceMs / oneDay);
  }
  
  const weeksBetween = (date1:Date, date2:Date) => {
    return daysBetween(date1, date2) / 7;
  };
  
  // const words = ref(0) -> use localStorage
  const words = useStorage('words', 0)
  // now words is a reactive variable, and it's stored in localStorage
  const nbMotsRestantsParSemaine = computed(() => {
    return Math.round((nbMots - words.value) / nbSemaines)
  })
  
  const nbMots = 15000
  const nbJours = daysBetween(new Date(), new Date(2024, 3, 15))
  const nbSemaines = Math.round(weeksBetween(new Date(), new Date(2024, 3, 15)))
  const motsParJour = Math.round(nbMots / nbJours)
  const motsParSemaine = Math.round(nbMots / nbSemaines)
  
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