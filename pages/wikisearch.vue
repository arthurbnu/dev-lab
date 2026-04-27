<template>

    <main class="space-y-4">

        <div class="px-4 fixed right-20 bottom-20">
            <UChip :text="exportList.length" size="3xl" color="" class = "!text-red-500" >
                <UButton color = "primary" variant="soft" class="px-4 border-teal-500 border-2" size="xl" icon="i-lucide-download" title = "Télécharger le csv" 
                @click = "download">
                </UButton>
            </UChip>
        </div>
        

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
            <li v-for="item in result?.pages" :key="item.id" @click="selectedResult = { id: item.id, key: item.key, descr: item.description }"
                class="w-full flex items-center m-1 p-1 rounded hover:brightness-125 bg-slate-300/10 gap-2 cursor-pointer">
                <UAvatar :src="item.thumbnail?.url || 'https://logo.clearbit.com/wikipedia.org'" class="w-12 h-12 mr-2 bg-white" size="md" />
                <!--  bouton PLUS pour ajouter  -->
                    <!-- <UButton @click.stop="exportList.push(item)" class="mt-4 absolute right-0" data-info = "btn-add" size="sm" icon="i-lucide-plus" color="primary" title = "Ajouter à la liste"></UButton> -->
                    <UButton @click.stop="handleAddToList(item)" class="mt-4 absolute right-0" data-info = "btn-add" size="sm" icon="i-lucide-plus" color="primary" title = "Ajouter à la liste"></UButton>

                <div>
                    <a :href="`https://${lang}.wikipedia.org/wiki/${item.key}`" target="_blank"
                        title="Voir l'article Wikipédia" class="hover:text-primary-500 hover:underline">
                        {{ item.title }}
                    </a>
                    <p class="text-gray-400">{{ item.description }}</p>

                    <!--  Propriétés wikidata trouvées pour le résultat cliqué -->
                    <div v-if="selectedResult.id === item.id" class="bg-slate-600/20 p-2 rounded-lg my-2"
                        :class="{ 'opacity-20': pendingSparql }">
                        <label class="text-primary-300 flex items- gap-2">
                            <!-- <UAvatar size="xs" :src="`https://logo.clearbit.com/${baseUrl}`" /> -->
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

        <!-- modal Infos - propriétés -->
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
var {time: timeProperties, place:  placeProperties} = jsonProperties


/*
--- mapping fichier import Octant et wikisearch
lés séparateurs sont des pipes

public ? --> Non (N)
en cours ? Oui si date de fin
provenance : wikidata
sources : url de l'élt wikidata 
id wikidata
disciplines : faudrait de l'ia pour déduire
type : pareil
mots clés : je le remplis pas (ou je laisse à l'user la possibilité de remplir à la main)
*/

const defaultValue = {
    language : 'fr',
    public: 'N',
    real: 'Y',
    origin: 'wikidata',
    disciplines: '',
    type: '',
    keywords : '',
    nominatimRef: '',
}

const exportList = ref([])


const header = "Langue,Titre,Description,Date début,Affichage date début,Date fin,Affichage date fin,Evénement en cours,Nom du lieu *,Référence Nominatim,Coordonnées Latitude,Coordonnées Longitude,Réel,Public,Provenance,Sources*,identifiantBddExterne,Discipline*,Type*,Mots-clefs*"

// fusionne les valeurs par défaut (defaultValue) et l'elt sélectionné de exportList, et génère une ligne csv à partir des champs demandés
const getCsvValue = e => {
    console.log(e)
    const value = { ...defaultValue, ...e }

    // current item descrption
    // console.log(wikiItem.value)
    // console.log(wikiItem.value)
    // console.log(wikiItem.value)
    // console.log(wikiItem.value)
    // console.log(wikiItem.value)

    const csvLine = [
        value.language,
        `"${value.itemLabel?.value || ''}"`,
        `"${selectedResult.value.description}"`,
        value.debutLabels?.value || value.naissanceLabels?.value,
        value.startDateDisplay,
        value.finLabels?.value || value.mortLabels?.value,
        value.endDateDisplay,
        value.ongoingEvent,
        `"${value.locationName}"`,
        value.nominatimRef,
        value.latitude,     // à rajouter dans sparql
        value.longitude,    // à rajouter dans sparql
        value.real,
        value.public,
        value.origin,
        value.item.value,      // url wikidata
        value.item.value?.split('http://www.wikidata.org/entity/')[1],
        `"${value.disciplines}"`,
        `"${value.type}"`,
        `"${value.keywords}"`
    ].join(',')
    return csvLine
}

const download = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
        + header + "\n"
        + exportList.value.map(e => getCsvValue(e)).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "export.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link); // Clean up
}


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
const { data: sparqlResult, error: sparqlError, pending: pendingSparql, refresh } =
    await useFetch(`${baseUrl}/sparql`, { immediate: false, headers: headers, params: queryParams })

function toDate(date) {
    if (date.includes('|')) {
        return date.split(' | ').map(d => toDate(d)).join(' | ')
    }
    const stringDate = new Date(date).toLocaleDateString()
    return stringDate !== 'Invalid Date' ? stringDate : date
}

const wikidataItem = computed(() => sparqlResult.value?.results.bindings[0])

const handleAddToList = async item => {
    selectedResult.value = { id: item.id, key: item.key, description: item.description }
    await refresh()
    console.log('Selected result:', selectedResult.value)
    console.log('wiki item:', wikidataItem.value)
    // const newItem = { id: item.id, key: item.key, title: item.title, description: item.description }
    exportList.value.push(wikidataItem.value)
}

const title = 'Recherche Wikipédia + propriétés wikidata'
const description = 'Interface de recherche pour Wikipédia et affichage des propriétés wikidata correspondantes - dates et lieux'
useSeoMeta({
    title: title,
    description,
    ogImage: "https://dev-lab-one.vercel.app/sparql/wikisearch.png",
    ogUrl: "https://dev-lab-one.vercel.app/wikisearch",
    ogTitle: title,
    ogDescription: description,
});

</script>