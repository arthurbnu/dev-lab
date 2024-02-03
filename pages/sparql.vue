<template>
  <main class="min-h-screen">
    <h1 class="mb-1 text-center text-2xl flex flex-center q-x-gutter-md">
      <UAvatarGroup size="lg" class="m-6">
        <UAvatar v-for="(logo, id) in logos" :key="id" :src="logo" :alt="logo" 
          img-class="border-2 border-teal-700 border-solid transition-all hover:scale-125" />
      </UAvatarGroup>
      {{ title }}
    </h1>
    <transition-fade :duration="500">
      <p class="m-4 opacity-70 text-justify italic" v-if="sparqlQuery">
        <!-- Les données de la  <a href="https://fr.wikipedia.org/wiki/SPARQL" v-bind="linkParams">requête sparql</a> -->
        Les données de la <a :href="exampleRequest" v-bind="linkParams">requête sparql</a>
        (personnes célèbres ayant une page wikipedia en français)
        sont issues de <a href="https://www.wikidata.org/wiki/Wikidata:Main_Page" v-bind="linkParams">wikidata</a>,
        puis complétées par <a href="https://fr.dbpedia.org/" v-bind="linkParams">dbpedia</a> (images)
        et <a href="https://fr.wikipedia.org/" v-bind="linkParams">wikipedia</a> (infobox).
      </p>
    </transition-fade>
    <transition-scale group tag="div" class="space-y-4 text-center" :delay="200">
      <span v-for="(tag, id) in shownTags" :key="id"
        class="bg-teal-800 text-white px-3 mr-2 inline-block hover:bg-teal-600 transition-all border-teal-950">
        {{ tag }}
      </span>
    </transition-scale>

    <div class = "ma-auto flex items-center justify-center mt-4">
      <span class = "p-4 text-grey">
        Choix de la requête : 
      </span> 
      <span v-for="(title, id) in requestTitles"
        @click="indexRequest = id"
        class = "hover:text-teal-700 text-neutral rounded-sm cursor-pointer select-none m-3"
        :class="{'bg-teal-700 text-white' : indexRequest === id}"
      >{{ title }}</span>
    </div>
 
    <div class="flex flex-center space-x-4 mt-3">
      <span class = "p-4 text-grey">
        Essayer un exemple : 
      </span> 
      <span v-for="example in examples">
        <span @click = "exampleSearch = example" class = "hover:text-teal-700 text-neutral rounded-sm cursor-pointer select-none">
          {{ example }} 
        </span>
      </span>
    </div>

    <AppOctantView v-if="show && sparqlQuery" :sparql-query="sparqlQuery" />

    <div class="">  
      <ContentList path="/sparql" v-slot="{ list }">
        <ContentQuery v-for="(item, id) in list" :key="item._path" :path="item._path" find="one" v-slot="{ data }">
          <ContentRenderer :value="data" >
            <code ref = "spql" class="hidden" :data-title="item.title">{{data.body.children[0].props.code}}</code>
            <ContentRendererMarkdown :value="data" ref="md"
              class="max-w-full overflow-x-scroll bg-slate-800/50 px-5 pb-7" 
              :class="{'hidden' : indexRequest !== id}"
            />
          </ContentRenderer>
        </ContentQuery>
      </ContentList>
    </div>
  </main>
</template>

<script setup>
import { onMounted, watchEffect } from 'vue'
const toast = useToast()
const exampleSearch = ref('')
provide('exampleSearch', exampleSearch)

const examples = [
  'Charles',
  'de Vinci',
  'Louis XIV',
  'Marie Curie',
  'Dupont',
]

const show = ref(false)
const title = "Recherche wikidata avec sparql";
const description = "Exemple d'interrogation de la base Wikidata à l'aide du langage sparql";
const md = ref()
const spql = ref()

const linkParams = {
  target: "_blank",
  class: "text-teal-500"
}

const exampleRequest = computed(() => 'https://query.wikidata.org/#' + encodeURIComponent(sparqlQuery.value))
const timeBetweenTags = 50

const logos = [
  "https://logo.clearbit.com/wikidata.org",
  "https://logo.clearbit.com/dbpedia.org",
  "https://logo.clearbit.com/wikipedia.org",
]

// const requestUrl = "https://dev-lab-one.vercel.app/sparql/request.txt2"
// const { data: sparqlQuery, error: fetchError, pending: pending } = await useFetch(requestUrl)

const sparqlQuery = ref('')
const indexRequest = ref(0)
const requestTitles = ref([])
watchEffect(() => {
  if (spql.value) {
    requestTitles.value = spql.value.map(item => item.dataset.title)
    sparqlQuery.value = spql.value[indexRequest.value].innerText.trim()
    console.log("requestTitles : ", requestTitles.value)
    console.log('md renderer : ', md.value)
  }
})

// const changeRequest = (title) => {
//   const indexInTitles = requestTitles.value.indexOf(title)
//   if (indexInTitles !== -1) {
//     indexRequest.value = indexInTitles
//     sparqlQuery.value = spql.value[indexInTitles].innerText.trim()
//   } 
// }

onMounted(() => {
  for (let i = 0; i < tags.length; i++) {
    setTimeout(() => {
      shownTags.value.push(tags[i])
    }, timeBetweenTags * i);
  }
  setTimeout(() => {
    show.value = true
  }, timeBetweenTags * tags.length);
})

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

const tags = ['sparql',
  "wikipedia",
  "dbpedia",
  "wikidata",
  "rdf",
  "api",
  "vuejs",
];

const shownTags = ref([])

</script>