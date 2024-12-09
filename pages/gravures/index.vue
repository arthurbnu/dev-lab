<template>
    <main class="space-y-8">
        <div class="flex place-items-center justify-between">
            <fieldset class="inline-flex place-items-center gap-5">
                <h1 class="text-xl capitalize">
                    {{ table }}
                 </h1>
                <USelect v-model="table" :options="tables" variant="none" class="border-teal-700 border-2 rounded-lg [&>*]:!text-primary-500" />
            </fieldset>
            <fieldset class="inline-flex place-items-center gap-5">
                <label>Max : {{ limit }}</label>
                <URange v-model="limit" class="w-44" />
            </fieldset>
            <UInput ref = "searchInput" v-model="search" :variant="'outline'" color="gray" placeholder="Rechercher" />
        </div>

        <div v-auto-animate class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 m-auto">
            <!-- <QCard v-for="(entry, id) in foundResults" :key="id" dark class="m-1 hover:scale-105 transition-all will-change-transform border-teal-400/20"> -->
            <QCard v-for="(entry, id) in sqlResult?.result" :key="id" dark class="m-1 hover:scale-105 transition-all will-change-transform border-teal-400/20">
                <NuxtLink :to="`/gravures/${table}-${getId(entry)}`" >
                    <div class="h-48 lg:h-40 overflow-hidden relative">
                        <UAvatar class="absolute z-20 top-2 left-2 bg-gray-700" size="md">
                            <UIcon dynamic name="i-lucide-book" />
                        </UAvatar>
                        <NuxtImg src="gravures/bnu.png" alt="bnu" height="300" width="400" class="opacity-30" />
                    </div>
                    <div class="p-4 space-y-2">
                        <h2 class="text-xl font-bold">{{ getTitle(entry) }}</h2>
                        <p class="text-gray-400 break-all">{{ getDescription(entry) }}</p>
                        <p class="mt-2">
                            <span v-for="(badge, i) in [entry.DAT ?? entry.DATE]" class="mr-2">
                                <UBadge :key="i" color="indigo" variant="outline">
                                    {{ badge }}
                                </UBadge>
                            </span>
                        </p>
                        <div class="inline-flex gap-4">
                            <a :href = "biblioLink(entry)" target="_blank" class="text-primary-500 hover:underline">Biblio.bnu</a>
                            <a :href = "`https://www.google.com/search?q=${getTitle(entry)}`" target="_blank" class="text-primary-500 hover:underline">Gallica</a>
                        </div>
                    </div>
                </NuxtLink>
            </QCard>
        </div>

        <section>
            <h2 class="text-xl">Données brutes</h2>
            <pre class=" max-w-[100vw] overflow-x-scroll">{{ sqlResult?.info }}</pre>
            <pre class=" max-w-[100vw] overflow-x-scroll">{{ sqlResult }}</pre>
        </section>
    </main>
</template>

<script setup>
import { refDebounced } from '@vueuse/core'
const tables = ['bois', 'gravures', 'livres', 'dicos', 'illustrations']
const table = ref('bois')
const limit = ref(100)

const searchInput = ref()
const search = ref('')
const debounceSearch = refDebounced(search, 300)
const { data: sqlResult } = await useFetch('/api/gravures', {params: { limit: limit, table: table, search: debounceSearch, client : process.client } })

const getId = entry => entry.REFG ?? entry.REFL ?? entry.NUM
const getTitle = entry => entry.TIT ?? entry.TITL ?? entry.DE ?? entry.BOIS
const getDescription = entry => entry.REP ?? entry.AUT ?? entry.FR ?? entry.REPI
const matchSearch = (_entryProp, _search) => _entryProp.toUpperCase().includes(_search.toUpperCase())

const foundResults = computed(() => {
    if (debounceSearch.value.length < 3)
        return sqlResult.value?.result
    return sqlResult.value.result.filter(r =>
        matchSearch(getTitle(r), debounceSearch.value) ||
        matchSearch(getDescription(r), debounceSearch.value)
    )
})

const biblioLink = entry => {
    const query = entry.COT ?? getTitle(entry)
    return encodeURI( `https://biblio.bnu.fr/opac/query/${query}}`)
}
const gallicaLink = entry => `https://biblio.bnu.fr/opac/query/${encodeURI(getTitle(entry))}`

watchEffect(() => table.value && searchInput.value?.input?.focus())

// SEO - Page sqlResult
const baseUrl = 'https://dev-lab-one.vercel.app/'
const title = "Gravures";
const description = "Gravures et autres imprimés anciens et jolis";

useSeoMeta({
    title: title,
    description,
    author: "arthur.brody@bnu.fr",
    ogImage: baseUrl + "val/val-renaissance2.png",
    ogUrl: baseUrl + 'gravures',
    ogType: "website",
    ogTitle: title,
    ogDescription: description,
    robots: "noindex, nofollow",
    themeColor: "teal",
});


</script>