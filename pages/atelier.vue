<template>
  <main class="bg-teal-400/5 p-4 space-y-8 my-main-bg">
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
      <p>Liens utiles</p>
      <div class="text-teal-400 flex gap-10">
        <a v-for="(link, i) in links" :href="link.url" target="_blank">{{ link.name }}</a>
      </div>
    </section>

    <section v-if="alsacianItems" class="">
      <h3 class="text-lg mb-2">Créatrices alsaciennes</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 my-animate-children-appear">
        <div v-for="item in alsacianItems" :key="item.creatrice.value"
          class="bg-white p-4 rounded-lg shadow hover:scale-105 transition-transform">

          <a :href="item.article.value" target="_blank" class="text-blue-500 hover:underline">
            {{ item.creatriceLabel?.value }}
          </a>

          <p class="mt-2">
            <img :src="item.image?.value ?? 'https://logo.clearbit.com/wikipedia.org'" :alt="item.creatriceLabel?.value"
              loading="lazy" class="w-full h-auto rounded-md" :class="{ 'opacity-10': !item.image?.value }" />
          </p>
          <p v-if="item.lieuNaissanceLabel?.value" class="text-sm text-gray-600 mt-1">
            Lieu de naissance: {{ item.lieuNaissanceLabel.value }}
          </p>
        </div>
      </div>

      <pre class="hidden">
        {{ alsacianItems }}
      </pre>
    </section>

    <section class="hidden">
      {{ items }}
    </section>

    <section class="my-10" v-if="alsacianItems">
      <ContentList path="/atelier" v-slot="{ list }">
        <ContentQuery v-for="(item, id) in list" :key="item._path" :path="item._path" find="one" v-slot="{ data }">
          <ContentRenderer :value="data">
            <a :href="'https://query.wikidata.org/#' + encodeURIComponent(data.body.children[0].props.code)"
              target="_blank" class=" flex items-center">
              <UAvatar :src="'https://logo.clearbit.com/wikidata.org'" class="mr-2 bg-white" size="xs" />
              Voir la Requête sparql :
              <span class="text-blue-400 ml-2"> {{ data.title }}</span>
            </a>
            <ContentRendererMarkdown :value="data" ref="md"
              class="max-w-full overflow-x-scroll bg-slate-800/50 px-5 pb-7 mt-2" />
          </ContentRenderer>
          <div class="w-1 h-10"></div>
        </ContentQuery>
      </ContentList>
    </section>

    <section v-if="items" class="border-blue-300 border-solid border-l-4 pl-3 ">
      <h3 class="text-lg mb-2">Dernières créatrices ajoutées / modifiées sur Wikidata</h3>
      <ul v-auto-animate>
        <li v-for="creatrice in items" :key="creatrice.creatrice.value" class="flex gap-10 justify-between">
          <a :href="creatrice.creatrice.value" target="_blank">
            {{ creatrice?.creatriceLabel?.value }}
            <span class="hidden">
              {{ creatrice?.date?.value }}
            </span>
          </a>
          <span class="text-gray-500">
            {{ new Date(creatrice?.modified?.value).toLocaleDateString() }}
          </span>
        </li>
      </ul>
    </section>

  </main>
</template>

<script setup>
const baseUrl = 'https://dev-lab-one.vercel.app/'

const title = "Atelier Wikipédia"
const description = "Femmes illustres et de science "
const imgUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Wikidata-logo-en.svg/1024px-Wikidata-logo-en.svg.png"

const shownTags = ref([])
const timeBetweenTags = 50
const tags = [
  "Wikipédia",
  "Wikidata",
  "éditathon",
  "créatrices",
  "BNU - Lab",
  "Urfist",
];

const logos = [
  "wikipedia.org",
  "wikidata.org",
  // "bnu.fr",
]

const links = [
  {
    name: "Pad",
    url: "https://urls.fr/F79H3I"
  },
  {
    name: "Page projet",
    url: "https://fr.wikipedia.org/wiki/Projet:Wikifier_la_science/Strasbourg/%C3%89ditathon_Bnu"
  },
  {
    name: "Wikimedia",
    url: "https://wikimedia.org/"
  },
  {
    name: "Wikipédia",
    url: "https://wikipedia.org/"
  },
  {
    name: "Wikidata",
    url: "https://wikidata.org/"
  },

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
const lastcreatrices = computed(() => `
# Requête SPARQL pour les créatrices ajoutées/modifiées récemment
SELECT ?creatrice ?creatriceLabel ?modified ?date
WHERE {
bind('${requestDate.value}}' as ?date)
  ?creatrice wdt:P7578 ?id;  
        schema:dateModified ?modified .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en,fr". }
}
ORDER BY DESC(?modified) 
LIMIT 10`)


const maxChars = ref(20)

const endPoint = 'https://query.wikidata.org/sparql?query='
const fullUrl = computed(() => endPoint + encodeURIComponent(lastcreatrices.value))

const headers = { 'Accept': 'application/json' };
const { data: items, execute: refresh } = await useFetch(fullUrl, { headers: headers, server: false, transform: res => res.results.bindings });

const wikiApiUrl = 'https://fr.wikipedia.org/w/api.php?action=query&origin=*&prop=info&titles='
const wikiApiParams = '&format=json'


const alsacianCreatrices = computed(() => `
# Requête SPARQL pour les créatrices alsaciennes
#title: Créatrices d'Alsace
# #defaultView:ImageGrid
SELECT DISTINCT ?creatrice ?creatriceLabel ?professionLabel ?image ?id ?lieuNaissanceLabel ?article ?statements ?siteLinks ?articleName
# (GROUP_CONCAT(DISTINCT ?professionLabel; separator=", ") as ?p)
WHERE {
  ?creatrice wdt:P31 wd:Q5;
#   wdt:P106 ?profession;
    wdt:P19 ?lieuNaissance;
    wdt:P7578 ?id;
    wdt:P21 wd:Q6581072;
    wdt:P27 wd:Q142.
  
  ?creatrice wikibase:sitelinks ?siteLinks;
             wikibase:statements ?statements.
             
  OPTIONAL { ?creatrice wdt:P18 ?image. }
  OPTIONAL {
    ?article schema:about ?creatrice;
    schema:name ?articleName;
    schema:isPartOf <https://fr.wikipedia.org/>;
    schema:inLanguage "fr".
  }
  ?lieuNaissance wdt:P131 ?loc.
  FILTER(?loc IN(wd:Q12717, wd:Q12722))
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr". }
}
ORDER BY (?statements)
LIMIT 100
`)

const getLengthFromWikiApi = async (url) => {
  if (!url) {
    return 0; // Pas d'article, pas de longueur
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  const pageId = Object.keys(data.query.pages)[0];
  return data.query.pages[pageId].length || 0;
}

const fullUrlAlsacian = computed(() => endPoint + encodeURIComponent(alsacianCreatrices.value))
const { data: alsacianItems, execute: refreshAlsacian } = await useFetch(fullUrlAlsacian, {
  headers: headers,
  server: false,
  transform: async res => {
    // On initialise articleLength à null
    const items = res.results.bindings.map(item => ({
      ...item,
      apiUrlForLength: wikiApiUrl + item.article.value.split('/').pop().split(':').pop() + wikiApiParams,
      articleLength: null
    }));

    // On attend que toutes les longueurs soient récupérées
    await Promise.all(
      items.map(async (item) => {
        item.articleLength = await getLengthFromWikiApi(item.apiUrlForLength);
      })
    );

    items.sort((a, b) => (a.articleLength || 0) - (b.articleLength || 0))
    console.log('Alsacian items fetched:', items)
    return items
  }
});


// watch(alsacianItems, (newValue) => {
//   console.log('Alsacian items updated:', newValue);
// }, { immediate: true });



</script>

<style>
body:has(.my-main-bg) {
  background-color: #000000;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2000 1500'%3E%3Cdefs%3E%3Crect stroke='%23000000' stroke-width='0.8' width='1' height='1' id='s'/%3E%3Cpattern id='a' width='3' height='3' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cuse fill='%23242424' href='%23s' y='2'/%3E%3Cuse fill='%23242424' href='%23s' x='1' y='2'/%3E%3Cuse fill='%23333333' href='%23s' x='2' y='2'/%3E%3Cuse fill='%23333333' href='%23s'/%3E%3Cuse fill='%233e3e3e' href='%23s' x='2'/%3E%3Cuse fill='%233e3e3e' href='%23s' x='1' y='1'/%3E%3C/pattern%3E%3Cpattern id='b' width='7' height='11' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cg fill='%23484848'%3E%3Cuse href='%23s'/%3E%3Cuse href='%23s' y='5' /%3E%3Cuse href='%23s' x='1' y='10'/%3E%3Cuse href='%23s' x='2' y='1'/%3E%3Cuse href='%23s' x='2' y='4'/%3E%3Cuse href='%23s' x='3' y='8'/%3E%3Cuse href='%23s' x='4' y='3'/%3E%3Cuse href='%23s' x='4' y='7'/%3E%3Cuse href='%23s' x='5' y='2'/%3E%3Cuse href='%23s' x='5' y='6'/%3E%3Cuse href='%23s' x='6' y='9'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='h' width='5' height='13' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cg fill='%23484848'%3E%3Cuse href='%23s' y='5'/%3E%3Cuse href='%23s' y='8'/%3E%3Cuse href='%23s' x='1' y='1'/%3E%3Cuse href='%23s' x='1' y='9'/%3E%3Cuse href='%23s' x='1' y='12'/%3E%3Cuse href='%23s' x='2'/%3E%3Cuse href='%23s' x='2' y='4'/%3E%3Cuse href='%23s' x='3' y='2'/%3E%3Cuse href='%23s' x='3' y='6'/%3E%3Cuse href='%23s' x='3' y='11'/%3E%3Cuse href='%23s' x='4' y='3'/%3E%3Cuse href='%23s' x='4' y='7'/%3E%3Cuse href='%23s' x='4' y='10'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='c' width='17' height='13' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cg fill='%23515151'%3E%3Cuse href='%23s' y='11'/%3E%3Cuse href='%23s' x='2' y='9'/%3E%3Cuse href='%23s' x='5' y='12'/%3E%3Cuse href='%23s' x='9' y='4'/%3E%3Cuse href='%23s' x='12' y='1'/%3E%3Cuse href='%23s' x='16' y='6'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='d' width='19' height='17' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cg fill='%23000000'%3E%3Cuse href='%23s' y='9'/%3E%3Cuse href='%23s' x='16' y='5'/%3E%3Cuse href='%23s' x='14' y='2'/%3E%3Cuse href='%23s' x='11' y='11'/%3E%3Cuse href='%23s' x='6' y='14'/%3E%3C/g%3E%3Cg fill='%23585858'%3E%3Cuse href='%23s' x='3' y='13'/%3E%3Cuse href='%23s' x='9' y='7'/%3E%3Cuse href='%23s' x='13' y='10'/%3E%3Cuse href='%23s' x='15' y='4'/%3E%3Cuse href='%23s' x='18' y='1'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='e' width='47' height='53' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cg fill='%2354E009'%3E%3Cuse href='%23s' x='2' y='5'/%3E%3Cuse href='%23s' x='16' y='38'/%3E%3Cuse href='%23s' x='46' y='42'/%3E%3Cuse href='%23s' x='29' y='20'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='f' width='59' height='71' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cg fill='%2354E009'%3E%3Cuse href='%23s' x='33' y='13'/%3E%3Cuse href='%23s' x='27' y='54'/%3E%3Cuse href='%23s' x='55' y='55'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='g' width='139' height='97' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'%3E%3Cg fill='%2354E009'%3E%3Cuse href='%23s' x='11' y='8'/%3E%3Cuse href='%23s' x='51' y='13'/%3E%3Cuse href='%23s' x='17' y='73'/%3E%3Cuse href='%23s' x='99' y='57'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23a)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23b)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23h)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23c)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23d)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23e)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23f)' width='100%25' height='100%25'/%3E%3Crect fill='url(%23g)' width='100%25' height='100%25'/%3E%3C/svg%3E");
  background-attachment: fixed;
  background-size: cover;
}
</style>

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

@keyframes appear {
  from {
    opacity: 0;
    scale: .9
  }

  to {
    opacity: 1;
    scale: 1
  }
}

.my-animate-children-appear {
  padding-bottom: 200px;
}

.my-animate-children-appear>div {
  animation: appear linear both;
  animation-timeline: view();
  animation-range: entry 30% cover 25%;
}
</style>