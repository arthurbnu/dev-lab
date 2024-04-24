<template>

    <main class="space-y-4">
        <div class="flex items-baseline gap-3">
            <h1 class="text-2xl">Recherche Wikipédia
                <span class="text-sm m-3 text-gray-400">Trouver un article par son titre</span>
            </h1>
        </div>
        <div class="flex items-center gap-3 [&>label]:ml-6 [&>label]:text-gray-400 bg-slate-600/20 p-2 rounded-lg">
            <UIcon name="i-lucide-settings" class="text-gray-500 text-xl" />
            <fieldset>Paramètres</fieldset>
            <label>Langue</label>
            <UInput v-model="lang" icon="i-lucide-globe" placeholder="fr" rounded color="primary" size="sm"
                class="w-20" />
            <label>Résultats max</label>
            <span class="inline-block w-4">{{ nbMax }}</span>
            <URange v-model="nbMax" :min="1" :max="50" color="primary" size="sm" class="w-32" />
            <!-- uselect instead -->
            <!-- <USelect v-model="lang" :options="['fr', 'en', 'de', 'es']" color="primary" size="sm" class="w-20 [&>*]:!bg-teal-400/20" /> -->
        </div>
        <UInput v-model="search" icon="i-lucide-search" placeholder="Rechercher un article" rounded color="primary"
            :class="{ 'animate-pulse': pending }" />

        <!-- <h2 v-if="error" class="text-red-500">{{ error }}</h2> -->
        <ul v-auto-animate>
            <li v-for="item in result?.pages" :key="item.id" @click="currentKey = item.id"
                class="w-full flex items-center m-1  p-1 rounded hover:brightness-125 bg-slate-300/10 gap-2">
                <UAvatar :src="item.thumbnail?.url || 'https://logo.clearbit.com/wikipedia.org'"
                    class="w-12 h-12 mr-2 bg-white" size="md" />
                <div>
                    <a :href="`https://${lang}.wikipedia.org/wiki/${item.key}`" target="_blank"
                        class="hover:text-teal-500 hover:underline">
                        {{ item.title }}
                    </a>
                    <p class="text-sm text-gray-400  mr-2">{{ item.description }}</p>

                    <div v-if="currentKey === item.id" class="bg-slate-600/20 p-2 rounded-lg my-2" :class="{ 'opacity-20': pendingSparql }">
                        <label class="text-primary-300">Propriétés wikidata</label> <br>
                        <fieldset v-for="wikiItem in sparqlResult?.results.bindings" class="space-y-3 flex flex-col [&>label]:font-bold" >
                            <template v-if = "wikiItem.lieuxLabel.value || wikiItem.date || wikiItem.debut || wikiItem.fin">
                                <label>Lieu</label>{{ wikiItem.lieuxLabel?.value }}
                                <label >Date</label> {{ toDate(wikiItem.date?.value)}}
                                <label>Début</label>{{ toDate(wikiItem.debut?.value) }}
                                <label>Fin</label>{{ toDate(wikiItem.fin?.value) }}
                            </template>
                            <span v-else class="text-red-500/50"> Aucune information trouvée</span>
                        </fieldset>
                        <!-- <pre>
                            {{  sparqlResult?.results.bindings }}
                        </pre> -->
                    </div> 
                </div>
            </li>
        </ul>
        <!-- <pre>
            {{ result }}
        </pre> -->
    </main>
</template>

<script setup>
import { refDebounced } from '@vueuse/core'

// params
const lang = ref('fr')
const nbMax = ref(20)

// wiki rest.php
const url = computed(() => `https://${lang.value}.wikipedia.org/w/rest.php/v1/search/title?q=`)
const search = ref('')
const debounceSearch = refDebounced(search, 200)
const searcUrl = computed(() => url.value + debounceSearch.value + `&limit=${nbMax.value}`)

const { data: result, error: error, execute: execute, pending: pending } = 
    await useFetch(searcUrl, { immediate: false})

// sparql
const currentKey= ref(null)
const baseUrl = 'https://query.wikidata.org/sparql?query='

// from page id
const sparqlQuery = computed(
    () => `
    select ?item ?itemLabel ?date ?debut ?fin  
    (GROUP_CONCAT(distinct ?lieuLabel;separator=" | ") as ?lieuxLabel) 
    where {
        SERVICE wikibase:mwapi {
            bd:serviceParam wikibase:endpoint "fr.wikipedia.org" .
            bd:serviceParam wikibase:api "Generator" .
            bd:serviceParam mwapi:generator "revisions" .
            bd:serviceParam mwapi:pageids "${currentKey.value}" .
            ?item wikibase:apiOutputItem mwapi:item .
        }
        
        OPTIONAL{ ?item wdt:P585  ?date }    # Point in time
        OPTIONAL{ ?item wdt:P580 ?debut }
        OPTIONAL{ ?item wdt:P582 ?fin }
        OPTIONAL{ ?item wdt:P276 ?lieu}
        
        SERVICE wikibase:label { bd:serviceParam wikibase:language "${lang.value}". }
          
        SERVICE wikibase:label {
            bd:serviceParam wikibase:language "${lang.value}".
            ?lieu rdfs:label ?lieuLabel.
        }
    }
    GROUP BY ?item ?itemLabel ?date ?debut ?fin 
    `
)   

// from key
// const sparqlQuery = computed(
//     () => `
//     select ?item ?itemLabel ?date ?debut ?fin ?lieu where {
//         <https://${lang.value}.wikipedia.org/wiki/${currentKey.value}> schema:about ?item .
        
//         OPTIONAL{ ?item wdt:P585 ?date }    # Point in time
//         OPTIONAL{ ?item wdt:P580 ?debut }
//         OPTIONAL{ ?item wdt:P582 ?fin }
//         OPTIONAL{ ?item wdt:P276 ?lieu}
        
//         SERVICE wikibase:label { bd:serviceParam wikibase:language "${lang.value}". }
//     }`
// )

const sparqlUrl = computed(() => baseUrl + encodeURIComponent(sparqlQuery.value))
const headers = { 'Accept': 'application/json' };
const {data: sparqlResult, error: sparqlError, execute: executeSparql, pending: pendingSparql} = 
    await useFetch(sparqlUrl, {immediate: false, headers: headers})

watchEffect(() => {
    console.log('sparqlResult', sparqlResult.value)
})

function toDate(date) {
    return date && new Date(date).toLocaleDateString()
}

</script>