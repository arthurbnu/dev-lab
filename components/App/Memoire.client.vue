<template>
    <main class="min-h-screen">
        <AppHeader class="mb-1 text-center" :title="title" :description="description" />

        <!-- choose between words or pages -->
        <div class="flex justify-center mb-5">
            <div class="flex items-center mr-5">
                <input type="radio" id="words" name="type" value="Mots" v-model="wordOrPages" class = "hidden"/>
                <label for="words" 
                    class="ml-2 px-3 cursor-pointer hover:opacity-75 transition-all" 
                    :class = "wordOrPages === 'Mots' ? 'bg-blue-500' : 'bg-teal-700 '">
                    Mots
                </label>
            </div>
            <div class="flex items-center">
                <input type="radio" id="pages" name="type" value="Pages" v-model="wordOrPages" class = "hidden"/>
                <label for="pages" 
                    class="ml-2 px-3 cursor-pointer hover:opacity-75 transition-all" 
                    :class = "wordOrPages === 'Pages' ? 'bg-blue-500' : 'bg-teal-700 '">
                    Pages
                </label>
            </div>
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
                                        <div class="text-sm text-gray-900">{{ wordOrPages === 'Mots' ? nbMots : nbPages }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <input v-if="wordOrPages === 'Mots'" type="number" v-model="words" class=" text-white" />
                                        <input v-else type="number" v-model="pages" class=" text-white" />
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">{{ nbSemaines }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">
                                            {{ wordOrPages === 'Mots' ? nbMotsRestantsParSemaine : pagesRestantesParSemaine }}
                                        </div>
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
                <div :style="{ width: !ready ? '0' : percentSucceeded + '%' }" 
                    class="shadow-none flex flex-col whitespace-nowrap text-white justify-center bg-teal-800 transition-all duration-700">
                </div>
            </div>
        </div>
    </main>
</template>
  
<script setup lang = "ts">

import { onMounted } from 'vue'
import { useStorage } from '@vueuse/core'

type Type = 'Mots' | 'Pages'
const wordOrPages = useStorage<Type>('wordOrPages', 'Mots')

const words = useStorage('words', 0)
const pages = useStorage('pages', 0)

const ready = ref(false)
const title = "Objectif mémoire";
const description = "Mémoire | Objectif : 20/20 | 2024 ";
const wordsColumns = [
    'Nombre de mots total',
    'Nombre de mots déjà écrits',
    'Nombre de semaines',
    'Mots par semaine'
]
const PagesColumns = [
    'Nombre de pages total',
    'Nombre de pages déjà écrites',
    'Nombre de semaines',
    'Pages par semaine'
]
const columns = computed(() => wordOrPages.value === 'Mots' ? wordsColumns : PagesColumns)

onMounted(async () => {
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 300))
    ready.value = true
})

const daysBetween = (date1: Date, date2: Date) => {
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

const weeksBetween = (date1: Date, date2: Date) => daysBetween(date1, date2)/7

const nbMotsRestantsParSemaine = computed(() => Math.round((nbMots - words.value) / nbSemaines))
const pagesRestantesParSemaine = computed(() => Math.round((nbPages - pages.value) / nbSemaines))

const percentSucceeded = computed(() =>
    Math.round(wordOrPages.value === 'Mots' ? (words.value / nbMots) * 100 : (pages.value / nbPages) * 100
))

const nbMots = 15000, nbPages = 40
const nbSemaines = Math.round(weeksBetween(new Date(), new Date(2024, 3, 15)))

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


</script>