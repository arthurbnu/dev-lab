<template>
    <main class="space-y-8">
        <div class="flex place-items-center gap-4">
            <h1 class="text-primary text-xl">{{ TIT }} </h1>
            <UInput v-model = "search" variant = "outline" color = "gray" placeholder = "Rechercher une gravure"/>
        </div>

        <div v-auto-animate class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 m-auto">
            <QCard v-for="(val, id) in foundResults" :key="id" dark class="m-1 hover:scale-105 transition-all will-change-transform border-teal-400/20" :TIT="val.TIT" :REP="val.REP" bordered>
                <div class="h-48 lg:h-40 overflow-hidden relative">
                    <UAvatar class="absolute z-20 top-2 left-2 bg-gray-700" size="md">
                        <UIcon dynamic name="i-lucide-book" />
                    </UAvatar>
                    <NuxtImg src="gravures/bnu.png" alt="bnu" height="300" width="400" class="opacity-30"/>

                </div>
                <div class="p-4">
                    <h2 class="text-xl font-bold">{{ val.TIT }}</h2>
                    <p class="text-gray-400">{{ val.REP }}</p>
                    <p class="mt-2">
                        <span v-for="(badge, i) in ['hey', 'you']" class="mr-2">
                            <UBadge :key="i" color="indigo" variant="outline">
                                {{ badge }}
                            </UBadge>
                        </span>
                    </p>
                </div>
            </QCard>
        </div>

        <!-- <section>
            <pre>{{ data }}</pre>
        </section> -->
    </main>
</template>

<script setup>
import { refDebounced } from '@vueuse/core'

const { data } = await useFetch('/api/gravures')
const search = ref('')
const debounceSearch = refDebounced(search, 400)

const foundResults = computed(() => 
    debounceSearch.value.length < 3 ? data.value.result :
    data.value.result.filter(r => r.TIT.toUpperCase().includes(debounceSearch.value.toUpperCase()))
)


const baseUrl = 'https://dev-lab-one.vercel.app/'
const valImg = val => {
    const img = val.image ?? "val-sparql.png"
    return "val/" + img
}
const TIT = "Gravures";
const REP = "Gravures et autres imprimés anciens et jolis";

useSeoMeta({
    TIT: TIT,
    REP,
    author: "arthur.brody@bnu.fr",
    ogImage: baseUrl + "val/val-renaissance2.png",
    ogUrl: baseUrl,
    ogType: "website",
    ogTIT: TIT,
    ogREP: REP,
    robots: "index, follow",
    themeColor: "teal",
});


</script>