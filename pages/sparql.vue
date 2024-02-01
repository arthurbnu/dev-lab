<template>
  <main class="min-h-screen">
      <h1 class="mb-1 text-center text-2xl flex flex-center q-x-gutter-md">
        <UAvatarGroup size="md" class="m-6">
          <UAvatar
            v-for="(logo, id) in logos"
            :key="id"
            :src="logo"
            :alt="logo"
            class=""
          />
        </UAvatarGroup>
        {{ title }}
      </h1>
  
      {{ error }}
      <br>
      {{ pending ? "chargement..." : "TERMINE"}}
      {{ sparqlQuery }}
      <transition-fade :duration="500">
        <p class = "m-4 opacity-70 text-justify italic" v-if = "sparqlQuery">
            <!-- Les données de la  <a href="https://fr.wikipedia.org/wiki/SPARQL" v-bind="linkParams">requête sparql</a> -->
            Les données de la <a :href = "exampleRequest" v-bind="linkParams">requête sparql</a>
              (personnes célèbres ayant une page wikipedia en français)
            sont issues de <a href="https://www.wikidata.org/wiki/Wikidata:Main_Page" v-bind="linkParams" >wikidata</a>, 
            puis complétées par <a href="https://fr.dbpedia.org/" v-bind="linkParams">dbpedia</a> (images) 
            et <a href="https://fr.wikipedia.org/" v-bind="linkParams">wikipedia</a> (infobox).
        </p>
      </transition-fade>
    <!-- </AppHeader> -->
      <transition-scale group tag = "div" class = "space-y-4 text-center" :delay="200">
        <span v-for="(tag, id) in shownTags" :key="id"  
        class = "bg-teal-800 text-white px-3 mr-2 inline-block hover:bg-teal-600 transition-all border-teal-950" >
        {{ tag }}
      </span>
    </transition-scale>
    <AppOctantView v-if = "show && sparqlQuery" :sparql-query="sparqlQuery"/> 
  </main>
</template>

<script setup> 
import { onMounted } from 'vue'

const show = ref(false)
const title  = "Recherche wikidata avec sparql";
const description = "Exemple d'interrogation de la base Wikidata à l'aide du langage sparql";

const linkParams = {
  target: "_blank",
  class: "text-teal-500"
}

const sparqlQuery = ref('')
const exampleRequest = computed(() => 'https://query.wikidata.org/#' + encodeURIComponent(sparqlQuery.value))
const timeBetweenTags = 50 

const logos = [
  "https://logo.clearbit.com/wikidata.org",
  "https://logo.clearbit.com/dbpedia.org",
  "https://logo.clearbit.com/wikipedia.org",
  // "https://logo.clearbit.com/vuejs.org",
]
const error = ref(null)
const pending = ref(true)
onMounted(async () => {
  // sparqlQuery.value = (await useFetch("/sparql/request.txt", {
  //   responseType: "text",
    
  // })).data.value
  // do the same but also get the error
  try{
    const {data, myError, myPending} = await useFetch("/sparql/request.txt", {
      responseType: "text",
    }).catch(e => {
      console.log(e)
    })
    sparqlQuery.value = data.value
    error.value = myError
    pending.value = myPending
  } catch (e) {
    error.value = e

  }
  // const {data, myError} = await useFetch("/sparql/request2.txt", {
  //   responseType: "text",
  // })
  // sparqlQuery.value = data.value
  // error.value = myError
  if (error.value) console.log(error.value)
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