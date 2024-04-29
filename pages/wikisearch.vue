<template>

    <main class="space-y-4">
        <div class="flex items-baseline gap-3">
            <h1 class="text-2xl">Recherche Wikipédia
                <span class="text-sm m-3 text-gray-400">Et vérifications des propriétés wikidata correspondantes</span>
            </h1>
        </div>
        <!-- Paramètres -->
        <div class="flex items-center gap-3 md:[&>label]:ml-6 [&>label]:text-gray-400 bg-slate-600/20 p-2 rounded-lg">
            <UIcon name="i-lucide-settings" class="text-gray-500 text-xl" />
            <fieldset>Paramètres</fieldset>
            <label>Langue</label>
            <USelect v-model="lang" :options="['fr', 'en', 'de', 'es', 'it']" color="primary" icon="i-lucide-globe"
                size="sm" class="[&>*]:!text-primary-500 mr-4" />
            <label>Résultats max</label>
            <span class="inline-block w-4">{{ nbMax }}</span>
            <URange v-model="nbMax" :min="1" :max="50" color="primary" size="sm" class="w-32 mr-6" />
            <span class="flex-1 md:text-right">
                <UButton @click="open = !open" variant="soft" icon="i-lucide-info" color="primary" class="px-4"
                    size="sm">Infos</UButton>
            </span>
        </div>
        <UInput v-model="search" icon="i-lucide-search" placeholder="Rechercher un article" rounded color="primary"
            :class="{ 'animate-pulse': pending }" />

        <!-- <h2 v-if="error" class="text-red-500">{{ error }}</h2> -->
        <!-- Résultats -->
        <ul v-auto-animate>
            <li v-for="item in result?.pages" :key="item.id" @click="selectedResult = { id: item.id, key: item.key }"
                class="w-full flex items-center m-1 p-1 rounded hover:brightness-125 bg-slate-300/10 gap-2 cursor-pointer">
                <UAvatar :src="item.thumbnail?.url || 'https://logo.clearbit.com/wikipedia.org'"
                    class="w-12 h-12 mr-2 bg-white" size="md" />
                <div>
                    <a :href="`https://${lang}.wikipedia.org/wiki/${item.key}`" target="_blank"
                        title="Voir l'article Wikipédia" class="hover:text-primary-500 hover:underline">
                        {{ item.title }}
                    </a>
                    <p class="text-gray-400">{{ item.description }}</p>

                    <!--  Propriétés wikidata -->
                    <div v-if="selectedResult.id === item.id" class="bg-slate-600/20 p-2 rounded-lg my-2"
                        :class="{ 'opacity-20': pendingSparql }">
                        <label class="text-primary-300 flex items-center gap-2">
                            <UAvatar size="xs" :src="`https://logo.clearbit.com/${baseUrl}`" />
                            Propriétés wikidata
                            <a :href="`${baseUrl}/#${encodeURIComponent(sparqlQuery)}`" target="_blank"
                                class="text-white hover:text-primary-300 underline">
                                Voir la requête</a>
                            <a :href="`${sparqlResult?.results.bindings[0].item.value}`" target="_blank"
                                class="text-white hover:text-primary-500 underline">
                                Voir l'entité wikidata</a>
                        </label> <br>
                        <fieldset v-for="wikiItem in sparqlResult?.results.bindings" class="space-y-3 flex flex-col">
                            <label class="text-primary-500 flex items-center gap-2">
                                <UIcon name="i-lucide-map" />Lieux
                            </label>
                            <template v-for="prop in placeProperties">
                                <label v-if="!!wikiItem[prop.label + 'Labels']?.value">
                                    {{ prop.label }} : {{ wikiItem[prop.label + 'Labels']?.value }}
                                </label>
                            </template>
                            <br>
                            <label class="text-primary-500 flex items-center gap-2">
                                <UIcon name="i-lucide-calendar" class="mb-1" />Dates
                            </label>
                            <template v-for="prop in timeProperties">
                                <label v-if="!!wikiItem[prop.label + 'Labels']?.value">
                                    {{ prop.label }} : {{ toDate(wikiItem[prop.label + 'Labels']?.value) }}
                                </label>
                            </template>
                        </fieldset>
                    </div>
                </div>
            </li>
        </ul>

        <!-- modal - propriétés -->
        <UModal v-model="open" :transition="false" :ui="{ width: 'w-[80vw]' }" class="[&>*]:text-black p-2">
            <div class="p-4">
                <UIcon name="i-lucide-info" class="text-primary-500 align-middle mb-1" size="xl" />
                <span class="ml-2">Cliquer sur un résultat de recherche pour afficher les propriétés wikidata suivantes</span>
                <div v-for="(properties, i) in [placeProperties, timeProperties]" :key="i">
                    <h4>{{ i === 0 ? 'Lieux' : 'Dates' }}</h4>
                    <UTable :rows="properties" class="[&>table>thead]:hidden bg-slate-500/10 rounded [&>table>tbody>tr>td:last-child]:text-right">
                        <template #id-data="{ row }">
                            <a :href="`https://www.wikidata.org/wiki/Property:${row.id}`" target="_blank" class="text-primary-700 underline">{{ row.id }}</a>
                        </template>
                    </UTable>
                </div>
            </div>
        </UModal>
    </main>
</template>

<script setup>
import { refDebounced } from '@vueuse/core'
import jsonProperties from "@/assets/properties.json"
const {time: timeProperties,place:  placeProperties} = jsonProperties

const open = ref(false)

// search params
const lang = ref('fr')
const nbMax = ref(20)

// wiki rest.php
const url = computed(() => `https://${lang.value}.wikipedia.org/w/rest.php/v1/search/title`)
const search = ref('')
const debounceSearch = refDebounced(search, 200)

const { data: result, error: error, pending: pending } = await useFetch(url, { immediate: false, params: { q: debounceSearch, limit: nbMax } })

// sparql
const selectedResult = ref({ id: null, key: null })
const baseUrl = 'https://query.wikidata.org'

// functions to generate sparql query
function selectProps(properties) {
    return properties.map(prop => `?${prop.label}`)
}
function optionalProps(properties) {
    return properties.map(prop => `OPTIONAL{ ?item wdt:${prop.id} ?${prop.label} }`)
}
function groupProps(properties) {
    return properties.map(prop => `(GROUP_CONCAT(distinct ?${prop.label}Label; separator=" | ") as ?${prop.label}Labels)`)
}
function labelProps(properties) {
    return properties.map(prop => `?${prop.label} rdfs:label ?${prop.label}Label.`)
}

function timeAndPlace(fn) {
    return {
        time: fn(timeProperties),
        place: fn(placeProperties)
    }
}

const optional = timeAndPlace(optionalProps)
const group = timeAndPlace(groupProps)
const label = timeAndPlace(labelProps)
const select = timeAndPlace(selectProps)

// wikidata props from page id
const sparqlQuery = computed(() =>
    `#title: Requête pour la page ${selectedResult.value.key} - langue ${lang.value}
    SELECT ?item ?itemLabel
    (GROUP_CONCAT(DISTINCT ?notEmpty;separator=" | ") as ?notEmptyValue)
    # dates
    ${group.time.join(' ')} 
    # lieux
    ${group.place.join(' ')}
        WHERE {
            SERVICE wikibase:mwapi {
                bd:serviceParam wikibase:endpoint "${lang.value}.wikipedia.org" .
                bd:serviceParam wikibase:api "Generator" .
                bd:serviceParam mwapi:generator "revisions" .
                bd:serviceParam mwapi:pageids "${selectedResult.value.id}" .
                ?item wikibase:apiOutputItem mwapi:item .
            }

            # BIND( uri(concat("https://www.wikidata.org/entity/", ?item)) as ?itemUri)
            
            ${optional.time.join('\n')}
            ${optional.place.join('\n')}
            
            SERVICE wikibase:label { bd:serviceParam wikibase:language "${lang.value}". }
            SERVICE wikibase:label {
                bd:serviceParam wikibase:language "${lang.value}".
                ${label.time.join('\n')}
                ${label.place.join('\n')}
            }
            BIND( COALESCE(${select.time.join(', ')}, ${select.place.join(', ')}) as ?notEmpty)
        }
    GROUP BY ?item ?itemLabel
    `
)

const headers = { 'Accept': 'application/json' };
const queryParams = computed(() => { return { query: sparqlQuery.value } })
const { data: sparqlResult, error: sparqlError, pending: pendingSparql } =
    await useFetch(`${baseUrl}/sparql`, { immediate: false, headers: headers, params: queryParams })

watchEffect(() => {
    console.log('sparqlResult', sparqlResult.value)
})

function toDate(date) {
    if (date.includes('|')) {
        return date.split(' | ').map(d => toDate(d)).join(' | ')
    }
    const stringDate = new Date(date).toLocaleDateString()
    return stringDate !== 'Invalid Date' ? stringDate : date
}

const title = 'Recherche Wikipédia + propriétés wikidata'
const description = 'Interface de recherche pour Wikipédia et affichage des propriétés wikidata correspondantes - dates et lieux'
useSeoMeta({
    title: title,
    description,
    author: "A B",
    ogImage: "https://dev-lab-one.vercel.app/sparql/wikisearch.png",
    ogUrl: "https://dev-lab-one.vercel.app/wikisearch",
    ogTitle: title,
    ogDescription: description,
});

</script>