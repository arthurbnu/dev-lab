<template>
  <main class="bg-teal-400/5 p-4 space-y-8">
    <h1 class="flex items-center gap-2 text-2xl">
      <UAvatar v-for="logo in logos" :src="'https://logo.clearbit.com/' + logo" class="w-12 h-12 mr-2 bg-white"
        size="md" />
      {{ title }}
    </h1>
    <h2 class="opacity-75 h-5 text-lg">{{ description }}</h2>

    <transition-scale group tag="div" class="space-y-4" :delay="200">
      <span v-for="(tag, id) in shownTags" :key="id"
        class="bg-teal-800 text-white px-3 mr-2 inline-block hover:bg-teal-600 transition-all border-teal-950">
        {{ tag }}
      </span>
    </transition-scale>

    <section class="border-teal-300 border-solid border-l-4 pl-3">
      <p>Jeux de données</p>
      <div class="text-teal-400 flex gap-10">
        <a v-for="(link, i) in dataLinks" :href="link.url" target="_blank">{{ link.name }}</a>
      </div>
    </section>
    <section class="border-teal-300 border-solid border-l-4 pl-3">
      <p>Liens utiles</p>
      <div class="text-teal-400 flex gap-10">
        <a v-for="(link, i) in links" :href="link.url" target="_blank">{{ link.name }}</a>
      </div>
    </section>

    <section v-if="items" class="border-blue-300 border-solid border-l-4 pl-3 ">
      <h3 class="text-lg mb-2">Dernières pièces de théatre ajoutées / modifiées sur Wikidata</h3>
      <ul v-auto-animate>
        <li v-for="play in items" :key="play.play.value" class="flex gap-10 justify-between">
          <a :href="play.play.value" target="_blank">
            {{ play?.playLabel?.value }}
            <span class="hidden">
              {{ play?.date?.value }}
            </span>
          </a>
          <span class="text-gray-500">
            {{ new Date(play?.modified?.value).toLocaleDateString() }}
          </span>
        </li>
      </ul>
    </section>

    <section v-if="itemCharacters" class="border-blue-300 border-solid border-l-4 pl-3 ">
      <h3 class="text-lg mb-2 flex gap-4 items-center">Derniers personnages de pièces de théatre
        <URange v-model="maxChars" :min="10" :max="50" color="primary" size="sm" class="w-32 ml-4" />
        <span class="text-primary">
          {{ maxChars }}
        </span>
      </h3>
      <ul v-auto-animate>
        <li v-for="perso in itemCharacters" :key="perso.perso.value" class="flex gap-10 justify-between">
          <a :href="perso.perso.value" target="_blank">
            {{ perso.persoLabel?.value }}
          </a>
          <span class="text-gray-500">
            {{ new Date(perso.modified?.value).toLocaleDateString() }}
          </span>
        </li>
      </ul>
    </section>

    <section class="hidden">
      {{ items }}
    </section>

    <section class="my-10">
      <ContentList path="/wikidatathon" v-slot="{ list }">
        <ContentQuery v-for="(item, id) in list" :key="item._path" :path="item._path" find="one" v-slot="{ data }">
          <ContentRenderer :value="data">
            <a :href="'https://query.wikidata.org/#' + encodeURIComponent(data.body.children[0].props.code)"
              target="_blank" class=" flex items-center">
              <UAvatar :src="'https://logo.clearbit.com/wikidata.org'" class="mr-2 bg-white" size="xs" />
              Voir la Requête :
              <span class="text-blue-400 "> {{ data.title }}</span>
            </a>
            <ContentRendererMarkdown :value="data" ref="md"
              class="max-w-full overflow-x-scroll bg-slate-800/50 px-5 pb-7 mt-2" />
          </ContentRenderer>
          <div class="w-1 h-10"></div>
        </ContentQuery>
      </ContentList>
    </section>

  </main>
</template>

<script setup>
const baseUrl = 'https://dev-lab-one.vercel.app/'

const title = "Atelier Wikidata-thon"
const description = "Retrouvez les requêtes et les données en temps réel "
const imgUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Wikidata-logo-en.svg/1024px-Wikidata-logo-en.svg.png"

const shownTags = ref([])
const timeBetweenTags = 50
const tags = [
  'Atelier',
  "Wikidata",
  "Sparql",
  "BNU - Lab",
  "Urfist",
];

const logos = [
  "wikipedia.org",
  "wikidata.org",
  "openrefine.org/",
  // "bnu.fr",
]

const dataLinks = [
  {
    name: "Alsacien",
    url: "https://docs.google.com/spreadsheets/d/1tx2hku5XqqYFqcJceB5DXlUZ0K9bnqf38dlz14W2yBw"
  },
  {
    name: "Allemand",
    url: "https://dx.doi.org/10.34847/nkl.ccb28f8t"
  },
  {
    name: "Français",
    url: "https://docs.google.com/spreadsheets/d/1AQpMDE-zPuIeBfRXHadiDKK8B8OpYBMnlKpu3DOOXXU"
  }
]

const links = [

  {
    name: "Pad",
    url: "https://notes.wikimedia.fr/p/wikidatathon12decembre"
  },
  {
    name: "OpenRefine",
    url: "https://hub-paws.wmcloud.org/hub"
  },
  {
    name: "Constructeur de Requête ",
    url: "https://query.wikidata.org/"
  },
  {
    name: "Wikidata",
    url: "https://wikidata.org/"
  }
]

onMounted(() => {
  for (let i = 0; i < tags.length; i++) {
    setTimeout(() => {
      shownTags.value.push(tags[i])
    }, timeBetweenTags * i);
  }
  setTimeout(() => {
  }, timeBetweenTags * tags.length);

  setInterval(() => requestDate.value = new Date(Date.now()).toString(), 5000)

})

useSeoMeta({
  title: title,
  description,
  ogImage: imgUrl,
  ogUrl: baseUrl,
  ogType: "website",
  ogTitle: title,
  ogDescription: description,
  robots: "index, follow",
  themeColor: "teal",
});

const requestDate = ref('')
const lastPlays = computed(() => `
# Requête SPARQL pour les pièces de théâtre ajoutées/modifiées récemment
SELECT ?play ?playLabel ?modified ?date
WHERE {
bind('${requestDate.value}}' as ?date)
  ?play wdt:P31 wd:Q25379;  # L'élément est une pièce de théâtre
        schema:dateModified ?modified .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en,fr". }
}
ORDER BY DESC(?modified) 
LIMIT 10`)

const lastCharacters = computed(() => `
# Requête SPARQL pour les personnages de théâtre de théâtre ajoutées/modifiées récemment
SELECT ?perso ?persoLabel ?modified ?date
WHERE {
bind('${requestDate.value}}' as ?date)
  ?perso wdt:P31 wd:Q3375722;  # L'élément est une pièce de théâtre
        schema:dateModified ?modified .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en,fr". }
}
ORDER BY DESC(?modified)
LIMIT `)

const maxChars = ref(20)

const endPoint = 'https://query.wikidata.org/sparql?query='
const fullUrl = computed(() => endPoint + encodeURIComponent(lastPlays.value))
const fullUrlChars = computed(() => endPoint + encodeURIComponent(lastCharacters.value + maxChars.value))

const headers = { 'Accept': 'application/json' };
const { data: items, execute: refresh } = await useFetch(fullUrl, { headers: headers, server: false, transform: res => res.results.bindings });
const { data: itemCharacters, execute: refreshChars } = await useFetch(fullUrlChars, { headers: headers, server: false, transform: res => res.results.bindings });


</script>


<style scoped>
a:hover {
  text-shadow:
    0 0 7px rgba(0, 255, 170, 0.288),
    0 0 10px rgba(0, 255, 170, 0.288),
    0 0 21px rgba(0, 255, 170, 0.288),
    0 0 42px rgba(0, 255, 170, 0.288),
    0 0 82px rgba(0, 255, 170, 0.288),
    0 0 92px rgba(0, 255, 170, 0.288),
    0 0 102px rgba(0, 255, 170, 0.288),
    0 0 151px rgba(0, 255, 170, 0.288);
}
</style>